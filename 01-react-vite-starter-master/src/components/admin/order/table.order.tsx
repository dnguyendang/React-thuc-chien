import { getOrdersAPI } from "@/services/api";
import { ExportOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

type TSearch = {
    name: string;
    address: string;
}

const TableOrder = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [currentDataTable, setCurrentDataTable] = useState<IOrderTable[]>([])

    const [openViewOrderDetail, setOpenViewOrderDetail] = useState<boolean>(false)
    const [dataViewOrderDetail, setDataViewOrderDetail] = useState<IOrderTable | null>(null)

    const columns: ProColumns<IOrderTable>[] = [
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
                            setOpenViewOrderDetail(true)
                            setDataViewOrderDetail(entity)
                        }}
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: true,
            hideInSearch: true,
        }
    ]

    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.name) {
                            query += `&mainText=/${params.name}/i`
                        }
                        if (params.address) {
                            query += `&author=/${params.address}/i`
                        }
                    }

                    if (sort) {
                        if (sort?.totalPrice) {
                            query += `&sort=${sort.price === "ascend" ? "totalPrice" : "-totalPrice"}`
                        };
                        if (sort?.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else query += `&sort=-createdAt`;
                    }

                    const res = await getOrdersAPI(query);
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

                rowKey={"_id"}
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
                headerTitle="Table order"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-Order.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button >
                    </CSVLink>,
                ]}

            />
        </>
    )
}

export default TableOrder;