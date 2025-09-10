import { createUserAPI } from "@/services/api";
import { Modal, Form, Input, App, FormProps, Divider } from "antd";
import { useState } from "react";

interface IProps {
    openCreateUserModal: boolean;
    setOpenCreateUserModal: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

const CreateUser = (props: IProps) => {
    const { openCreateUserModal, setOpenCreateUserModal, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, password, email, phone } = values;
        setIsSubmit(true)
        const res = await createUserAPI(fullName, password, email, phone);
        if (res && res.data) {
            message.success('Tạo mới user thành công');
            form.resetFields();
            setOpenCreateUserModal(false);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xáy ra!",
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <Modal
            title="Thêm Mới Người Dùng"
            open={openCreateUserModal}
            onOk={() => { form.submit() }}
            onCancel={() => {
                setOpenCreateUserModal(false);
                form.resetFields();
            }}
            okText={"Tạo mới"}
            cancelText={"Hủy"}
            confirmLoading={isSubmit}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    name="fullName"
                    label="Tên hiển thị"
                    rules={[{ required: true, message: "Tên không được để trống!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Email không được để trống!" },
                        { type: 'email', message: "Email không đúng định dạng" }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    name="password"
                    label="Mật khẩu"
                    rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateUser;