import { updateUserAPI } from "@/services/api";
import { App, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    dataUpdateUser: IUserTable | null;
    setDataUpdateUser: (v: IUserTable | null) => void;
    openUpdateUserModal: boolean;
    setOpenUpdateUserModal: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
}


const UpdateUser = (props: IProps) => {
    const { refreshTable, dataUpdateUser, openUpdateUserModal, setDataUpdateUser, setOpenUpdateUserModal } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdateUser && dataUpdateUser._id) {
            form.setFieldsValue({
                _id: dataUpdateUser._id,
                fullName: dataUpdateUser.fullName,
                phone: dataUpdateUser.phone,
                email: dataUpdateUser.email,
            })
        }
    }, [dataUpdateUser])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values
        setIsSubmit(true)
        const res = await updateUserAPI(_id, fullName, phone)
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            form.resetFields();
            setOpenUpdateUserModal(false);
            setDataUpdateUser(null);
            refreshTable()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsSubmit(false);
    };

    const resetAndCloseModal = () => {
        form.resetFields();
        setOpenUpdateUserModal(false)
        setDataUpdateUser(null)
    }

    return (
        <Modal
            title="Cập nhật người dùng"
            open={openUpdateUserModal}
            onOk={form.submit}
            onCancel={() => resetAndCloseModal()}
            okText="Cập nhật"
            cancelText="Hủy"
            maskClosable={false}
            loading={isSubmit}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="ID"
                    name="_id"
                    hidden
                >
                </Form.Item>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                    name="fullName"
                    label="Tên hiển thị"
                    rules={[{ required: true, message: "teTên không được để trống!" }]}
                >
                    <Input />
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

export default UpdateUser;