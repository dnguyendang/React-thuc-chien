import { useCurrentApp } from "@/components/context/app.context";
import { Col, Form, FormProps, Input, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";


const { TextArea } = Input

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};

interface IProps {
    setCurrentStep: (v: number) => void;
};

const Payment = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const [form] = Form.useForm();
    const [isSubmint, setIsSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            })
        }
    }, [user])

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id)
            localStorage.setItem("carts", JSON.stringify(newCarts));
            //sync React Context
            setCarts(newCarts)
        }
    }

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className="order-book" key={`index-${index}`}>
                            <div className="book-content">
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`} />
                                <div className="title">
                                    {book?.detail?.mainText}
                                </div>
                                <div className="price">
                                    {new Intl.NumberFormat(
                                        'vi-VN', { style: 'currency', currency: 'VND' }
                                    ).format(currentBookPrice ?? 0)}
                                </div>
                            </div>
                            <div className="action">
                                <div className="quantity">
                                    <InputNumber
                                        // onChange={(value) => handleOnChangeInput(value as number, book.detail)}
                                        value={book.quantity}

                                    />
                                </div>
                                <div className="sum">
                                    Tổng:   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book.quantity || 0)}
                                </div>
                                <DeleteTwoTone
                                    className="delete"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemoveBook(book._id)}
                                    twoToneColor={"#eb2f96"}
                                />
                            </div>
                        </div>
                    )
                })}
                <div>
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setCurrentStep(0)}>
                        Quay trở lại
                    </span>
                </div>
            </Col>
        </Row >
    )
}


export default Payment;