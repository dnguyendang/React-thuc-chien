import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from 'react';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { v4 as uuidv4 } from 'uuid'

interface IProps {
    openViewBookDetail: boolean;
    setOpenViewBookDetail: (v: boolean) => void;
    dataViewBookDetail: IBookTable | null;
    setDataViewBookDetail: (v: IBookTable | null) => void;
}

const DetailBook = (props: IProps) => {
    const {
        dataViewBookDetail,
        openViewBookDetail,
        setDataViewBookDetail,
        setOpenViewBookDetail
    } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewBookDetail) {
            let imgThumbnail: any = {}
            const imgSlider: UploadFile[] = [];
            if (dataViewBookDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewBookDetail.thumbnail,
                    state: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewBookDetail.thumbnail}`
                }
            }
            if (dataViewBookDetail.slider && dataViewBookDetail.slider.length > 0) {
                dataViewBookDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewBookDetail])

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <Drawer
            title="Chức năng xem chi tiết"
            width={"50vw"}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => {
                setOpenViewBookDetail(false)
                setDataViewBookDetail(null)
            }}
            open={openViewBookDetail}
        >
            <Descriptions
                title="Thông tin book"
                bordered
                column={2}
            >
                <Descriptions.Item label="Id">{dataViewBookDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Tên sách">{dataViewBookDetail?.mainText}</Descriptions.Item>
                <Descriptions.Item label="Tác giả">{dataViewBookDetail?.author}</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat(
                    'vi-VN',
                    { style: 'currency', currency: 'VND' }
                ).format(dataViewBookDetail?.price ?? 0)}</Descriptions.Item>
                <Descriptions.Item label="Thể loại" span={2}>
                    <Badge status="processing">{dataViewBookDetail?.category}</Badge>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {dayjs(dataViewBookDetail?.createdAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {dayjs(dataViewBookDetail?.updatedAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions
                title="Ảnh Book"
            >
                <Descriptions.Item>
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={{ showRemoveIcon: false }}
                    >
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    )
}

export default DetailBook;