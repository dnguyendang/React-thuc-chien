import { Col, Divider, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[];
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpen, setIsOpen, currentIndex, items, title } = props
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const refGallery = useRef<ImageGallery>(null)

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex)
        }
    }, [isOpen, currentIndex])

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            closable={false}
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={currentIndex}
                        showThumbnails={false}
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0}
                    />
                </Col>
                <Col span={8}>
                    <h2 style={{ padding: "5px 0 20px 0" }}>{title}</h2>
                    <Row gutter={[20, 20]}>
                        {
                            items?.map((item, i) => {
                                return (
                                    <Col key={`image-${i}`}>
                                        <Image
                                            wrapperClassName={"img-normal"}
                                            width={100}
                                            height={100}
                                            src={item.original}
                                            preview={false}
                                            onClick={() => {
                                                refGallery?.current?.slideToIndex(i);
                                            }}
                                        />
                                        <div className={activeIndex === i ? "active" : ""}></div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalGallery;