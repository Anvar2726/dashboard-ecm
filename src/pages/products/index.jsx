import { Fragment, useState } from "react";

import {
  Button,
  Flex,
  Table,
  Image,
  Tooltip,
  Modal,
  Form,
  message,
  Popconfirm,
  InputNumber,
  Select,
  Pagination,
} from "antd";
import { Input } from "antd";

import {
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetProductsQuery,
  useGetProductsWithoutPaginationQuery,
} from "../../redux/query/products";
import { useGetCategoriesQuery } from "../../redux/query/categories";

const CategoriesPage = () => {
  const [form] = Form.useForm();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productCategoryId, setProductCategoryId] = useState(null);
  const [page, setPage] = useState(1);

  const params = { search, page, limit: 10 };

  // RTK Query hooks
  const { data: products, isLoading, refetch } = useGetProductsQuery(params);
  const { data: totalproducts, refetch: refetchV2 } = useGetProductsWithoutPaginationQuery(search);
  const { data } = useGetCategoriesQuery();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [addProductMutation] = useAddProductMutation();
  const [editProductMutation] = useEditProductMutation();

  // Handlers
  const showModal = () => {
    setIsModalOpen(true);
    setSelectedProduct(null);
    setProductCategoryId(null);
  };
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      values.categoryId = productCategoryId;
      if (!selectedProduct) {
        await addProductMutation(values).unwrap();
      } else {
        await editProductMutation({
          categoryId: productCategoryId,
          id: selectedProduct,
          values,
        }).unwrap();
      }
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error) {
      message.error(error.errorFields.map((e) => e.errors).join(", "));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onSearch = (value) => {
    setSearch(value.target.value);
    setPage(1);
  };

  const editProduct = (product) => {
    setSelectedProduct(product.id);
    setProductCategoryId(product.categoryId);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const deleteProduct = async ({ id, categoryId }) => {
    try {
      await deleteProductMutation({ id, categoryId }).unwrap();
      message.success("Product deleted successfully");
      refetch();
      refetchV2();
    } catch (error) {
      if (error?.errorFields) {
        message.error(error.errorFields.map((e) => e.errors).join(", "));
      } else if (error?.data?.message) {
        message.error(error.data.message);
      } else if (error?.message) {
        message.error(error.message);
      } else {
        message.error("Something went wrong while deleting the category or its products.");
      }
    }
  };

  const handleSelect = (value) => {
    setProductCategoryId(value);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => {
        return <Image height={100} width={100} src={url} />;
      },
    },
    {
      title: "Stock ",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = data?.find((cat) => cat.id === categoryId);
        return <span>{category ? category.name : "Unknown Category"}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (i) => {
        return (
          <Flex gap="middle">
            <Button onClick={() => editProduct(i)} type="primary">
              Edit
            </Button>
            <Popconfirm
              title="Delete category"
              description={<>Are you sure to delete this product?</>}
              onConfirm={() => deleteProduct(i)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Table
        title={() => (
          <Flex vertical={true} gap="middle">
            <Flex align="center" justify="space-between">
              <h1>Products ({totalproducts?.length})</h1>
              <Button type="primary" onClick={showModal}>
                Add Product
              </Button>
            </Flex>
            <Input placeholder="Searching category" onChange={onSearch} value={search} />
          </Flex>
        )}
        columns={columns}
        dataSource={products}
        rowKey={"id"}
        pagination={false}
        loading={isLoading}
      />
      {totalproducts?.length > 10 && (
        <Pagination
          align="end"
          current={page}
          total={totalproducts?.length}
          onChange={handlePage}
        />
      )}
      <Modal
        title={!selectedProduct ? "Add Product" : "Edit Product"}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        okText={!selectedProduct ? "Add product" : "Edit product"}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Product name"
            name="name"
            rules={[{ required: true, message: "Please input your product!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Avatar URL"
            name="avatar"
            rules={[{ required: true, message: "Please input your avatar!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input your description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Select
              value={productCategoryId ? productCategoryId : "Select a category"}
              style={{ width: "100%" }}
              onChange={handleSelect}
              options={data?.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please input your stock!" }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default CategoriesPage;
