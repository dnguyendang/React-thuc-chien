import { createBookAPI, getBookCategoryAPI, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Form, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { FormProps } from "antd/lib";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import { useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    openCreateBookModal: boolean
    setOpenCreateBookModal: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: any,
    slider: any,
}

const CreateBook = (props: IProps) => {

    const { openCreateBookModal, refreshTable, setOpenCreateBookModal } = props
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const { message, notification } = App.useApp();

    const [listCategory, setlistCategory] = useState<{ label: string, value: string }[]>([])

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false)
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false)

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getBookCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setlistCategory(d);
            }
        }
        fetchCategory();
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)

        const { author, category, mainText, price, quantity } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];

        const res = await createBookAPI({
            thumbnail,
            slider,
            mainText,
            author,
            price,
            quantity,
            category
        });

        if (res && res.data) {
            message.success('Tạo mới book thành công');
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
            setOpenCreateBookModal(false)
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider)
        }
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            if (type === "slider") setLoadingSlider(true)
            else setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            if (type === "slider") setLoadingSlider(false)
            else setLoadingThumbnail(false)
            return;
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }

            if (onSuccess)
                onSuccess('ok')
        } else {
            message.error(res.message)
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    return (
        <Modal
            title="Thêm Mới Sách"
            open={openCreateBookModal}
            onOk={() => { form.submit() }}
            onCancel={() => {
                setFileListSlider([])
                setFileListThumbnail([])
                setOpenCreateBookModal(false)
                form.resetFields();
            }}
            destroyOnClose={true}
            okButtonProps={{ loading: isSubmit }}
            okText={"Tạo mới"}
            cancelText={"Hủy"}
            confirmLoading={isSubmit}
            width={"50vw"}
            maskClosable={false}
        >
            <Divider />
            <Form
                form={form}
                name="form-create-book"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            name="mainText"
                            label="Tên sách"
                            rules={[{ required: true, message: "Tên sách không được để trống!" }]}

                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name="author"
                            label="Tác giả"
                            rules={[{ required: true, message: "Tác giả không được để trống!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: "Giá tiền không được để trống!" }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter=" vnd"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name="category"
                            label="Thể loại"
                            rules={[{ required: true, message: "Thể loại không được để trống!" }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategory}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            name="quantity"
                            label="Số lượng"
                            rules={[{ required: true, message: "Số lượng không được để trống!" }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: "Ảnh thumbnail không được để trống!" }]}
                            //convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, 'thumbnail')}
                                onRemove={(file) => handleRemove(file, 'thumbnail')}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
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
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Slider"
                            name="slider"
                            rules={[{ required: true, message: "Ảnh slider không được để trống!" }]}
                            //convert value from Upload => form
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                customRequest={(options) => handleUploadFile(options, 'slider')}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(info) => handleChange(info, 'slider')}
                                onRemove={(file) => handleRemove(file, 'slider')}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
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
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal >
    )
}

export default CreateBook;


