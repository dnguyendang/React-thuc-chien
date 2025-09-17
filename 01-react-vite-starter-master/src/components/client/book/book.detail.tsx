import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, Rate, Row } from "antd";
import { useRef, useState } from "react"
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";


interface IProps {

}

const BookDetail = (props: IProps) => {
    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const refGallery = useRef<ImageGallery>(null)

    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
    ];

    const handleOnClickImage = () => {
        // get current index onClick
        setIsOpenModalGallery(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex ?? 0)
    }

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
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
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className="author">Tác giả: <a href="#">DungND</a></div>"
                                <div className="title">How Psychology Works</div>
                                <div className="rating">
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="sold">
                                        <Divider type="vertical" />
                                        Đã bán 6969
                                    </span>
                                </div>
                                <div className="price">
                                    <span className="currency">
                                        {new Intl.NumberFormat(
                                            'vi-VN', { style: 'currency', currency: 'VND' }
                                        ).format(10000)}
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
                                        <button><MinusOutlined /></button>
                                        <input defaultValue={1} />
                                        <button><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="buy">
                                    <button className="cart">
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
                items={images}
                title={"hardcode"}
            />
        </div>
    )
}

export default BookDetail;