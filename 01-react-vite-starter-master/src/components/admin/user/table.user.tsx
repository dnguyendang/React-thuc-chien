import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';
import { CSVLink } from "react-csv";
import UpdateUser from './update.user';
import DeleteUser from './delete.user';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false)

    const [openImportModal, setOpenImportModal] = useState<boolean>(false)
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([])

    const [openUpdateUserModal, setOpenUpdateUserModal] = useState<boolean>(false)
    const [dataUpdateUser, setDataUpdateUser] = useState<IUserTable | null>(null)

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity)
                            setOpenViewDetail(true);
                        }}
                        href='#'>{entity._id}</a>
                )
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            copyable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Create At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"#f57800"}
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdateUser(entity)
                                setOpenUpdateUserModal(true)
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa user"
                            description="Bạn có chắc chắn muốn xóa user này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handleDeleteUser(entity._id)}
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteUser }}

                        >
                            <DeleteTwoTone
                                twoToneColor={"#ff4d4f"}
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeleteUser = async (id: string) => {
        setIsDeleteUser(true)
        const res = await deleteUserAPI(id)
        if (res && res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsDeleteUser(false)
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    onChange: (total, range) => {
                        return (
                            <div>{range[0]}-{range[1]} trên {total} rows</div>
                        )
                    },
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename='export-user.csv'
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenImportModal(true)}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateUserModal(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailUser
                dataViewDetail={dataViewDetail}
                openViewDetail={openViewDetail}
                setDataViewDetail={setDataViewDetail}
                setOpenViewDetail={setOpenViewDetail}
            />
            <CreateUser
                openCreateUserModal={openCreateUserModal}
                setOpenCreateUserModal={setOpenCreateUserModal}
                refreshTable={refreshTable}
            />
            <ImportUser
                openImportModal={openImportModal}
                setOpenImportModal={setOpenImportModal}
                refreshTable={refreshTable}
            />
            <UpdateUser
                openUpdateUserModal={openUpdateUserModal}
                setOpenUpdateUserModal={setOpenUpdateUserModal}
                dataUpdateUser={dataUpdateUser}
                setDataUpdateUser={setDataUpdateUser}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableUser;