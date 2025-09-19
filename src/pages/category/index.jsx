import React from "react";
import { Fragment, useState } from "react";

import {
  Button,
  Flex,
  Table,
  Image,
  Modal,
  Form,
  message,
  Popconfirm,
  InputNumber,
  Select,
  Pagination,
} from "antd";
import { Input } from "antd";
import {  useParams } from "react-router";
import { useAddCategoryProductMutation, useDeleteCategoryProductMutation, useEditCategoryProductMutation, useGetCategoryProductsQuery } from "../../redux/query/category";
import { useGetCategoriesQuery } from "../../redux/query/categories";

const CategoryPage = () => {
  // Variables
  let categoryName = "";
  
  // Hooks
  const [form] = Form.useForm();
  const {id: categoryId} = useParams();

  

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productCategoryId, setProductCategoryId] = useState(null);

  const params = { search};

  // RTK Query hooks
  const {data, isLoading, refetch} =  useGetCategoryProductsQuery({categoryId, params});
  const { data: categoryData } = useGetCategoriesQuery();
  const [addCategoryProduct] = useAddCategoryProductMutation();
  const [editCategoryProduct] = useEditCategoryProductMutation();
  const [deleteCategoryProduct] = useDeleteCategoryProductMutation();
  categoryName = categoryData?.find((el) => +el.id == categoryId).name
  
  

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
        //  await addProductMutation(values).unwrap();
        await addCategoryProduct({...values, id: categoryId}).unwrap();
      } else {
         await editCategoryProduct({
           categoryId: productCategoryId,
           productId: selectedProduct,
           body: values,
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
  };

  const editProduct = (product) => {
    setSelectedProduct(product.id);
    setProductCategoryId(product.categoryId);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const deleteProduct = async ({ id, categoryId }) => {
    try {
       await deleteCategoryProduct({  categoryId, productId: id }).unwrap();
      message.success("Product deleted successfully");
      refetch();
      //  refetchV2();
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
         const category = categoryData?.find((cat) => cat.id === categoryId);
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
              <h1>
                {categoryName}: total products ({data?.length})
              </h1>
              <Button type="primary" onClick={showModal}>
                Add Product
              </Button>
            </Flex>
            <Input placeholder="Searching category" onChange={onSearch} value={search} />
          </Flex>
        )}
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        pagination={false}
        loading={isLoading}
      />
      {/* {totalproducts?.length > 10 && (
       <Pagination align="end" current={page} total={totalproducts?.length} onChange={handlePage} />
     )} */}
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
          <Form.Item
            label="Choose category"
            name="categoryId"
            rules={[{ required: true, message: "Please choose your category!" }]}
          >
            <Select
              value={productCategoryId ? productCategoryId : "Select a category"}
              style={{ width: "100%" }}
              onChange={handleSelect}
              options={categoryData?.map((cat) => ({ label: cat.name, value: cat.id }))}
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

export default CategoryPage;
