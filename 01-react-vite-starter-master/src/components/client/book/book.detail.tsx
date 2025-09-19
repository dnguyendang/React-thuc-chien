import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, message, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react"
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import "styles/book.scss"
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
    currentBook: IBookTable | null
}

type UserAction = "MINUS" | "PLUS"

const BookDetail = (props: IProps) => {
    const { currentBook } = props
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const refGallery = useRef<ImageGallery>(null)

    const [currentQuantity, setCurrentQuantity] = useState<number>(0)

    const { carts, setCarts } = useCurrentApp();

    useEffect(() => {
        if (currentBook) {
            // build images
            const images = [];
            if (currentBook?.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            }
            if (currentBook?.slider) {
                currentBook.slider?.map(item => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originClass: "original-image",
                        thumbnailClass: "thumbnail-image",
                    })
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        // get current index onClick
        setIsOpenModalGallery(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleChangeButton = (type: UserAction) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value <= + currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }

    const handleAddToCart = () => {
        // update localStorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            //update 
            const carts = JSON.parse(cartStorage) as ICart[];

            //check exist
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);

            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts));

            //sync React Context
            setCarts(carts);
        } else {
            //create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            //sync React Context
            setCarts(data);
        }
        message.success("Thêm sản phẩm vào giỏ hàng thành công.")
    }
    console.log(carts)

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="author">Tác giả: <a href="#">{currentBook?.author}</a></div>
                                <div className="title">{currentBook?.mainText}</div>
                                <div className="rating">
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="sold">
                                        <Divider type="vertical" />
                                        Đã bán {currentBook?.sold ?? 0}
                                    </span>
                                </div>
                                <div className="price">
                                    <span className="currency">
                                        {new Intl.NumberFormat(
                                            'vi-VN', { style: 'currency', currency: 'VND' }
                                        ).format(currentBook?.price ?? 0)}
                                    </span>
                                </div>
                                <div className="delivery">
                                    <div>
                                        <span className="left">Vận chuyển</span>
                                        <span className="right">Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className="quantity">
                                    <span className="left">Số lượng</span>
                                    <span className="right">
                                        <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                        <input
                                            value={currentQuantity}
                                            onChange={(event) => handleChangeInput(event.target.value)} />
                                        <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="buy">
                                    <button className="cart" onClick={() => handleAddToCart()}>
                                        <BsCartPlus className="icon-cart" />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className="now">Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div >
    )
}

export default BookDetail;