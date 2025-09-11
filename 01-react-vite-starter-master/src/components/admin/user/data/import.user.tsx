import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { App, Modal, notification, Table, Upload } from 'antd';
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { useState } from 'react';
import { bulkCreateUserAPI } from '@/services/api';
import templateFile from "assets/template/user.xlsx?url";
const { Dragger } = Upload;

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

interface IProps {
    openImportModal: boolean;
    setOpenImportModal: (v: boolean) => void;
    refreshTable: () => void;
}

const ImportUser = (props: IProps) => {
    const { openImportModal, setOpenImportModal, refreshTable } = props;

    const { message } = App.useApp()
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,

        accept: ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (status === 'done') {
                console.log(info)
                message.success(`${info.file.name} file uploaded successfully.`);

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        //read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any[];

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj.id = i
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Build Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenImportModal(false);
        setDataImport([]);
        refreshTable();
    }

    return (
        <>
            <Modal title="Import Data User"
                width={"50vw"}
                open={openImportModal}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenImportModal(false)
                    setDataImport([])
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single. Only accept .csv, .xls, .xlsx or
                        &nbsp; <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download
                        >
                            Donwload Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Dữ liệu upload:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportUser;