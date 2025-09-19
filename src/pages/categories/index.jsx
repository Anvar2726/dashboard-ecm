import { Fragment, useState } from "react";

import { Button, Flex, Table, Image, Tooltip, Modal, Form, message, Popconfirm } from "antd";
import { Input } from "antd";
import axios from "axios";

import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetCategoriesQuery,
} from "../../redux/query/categories";

import { ENDPOINT } from "../../consts";
import { Link } from "react-router";

const ProductsPage = () => {
  const [form] = Form.useForm();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const params = { search };

  // RTK Query hooks
  const { data: categories, isLoading, refetch } = useGetCategoriesQuery(params);
  const [addCategory] = useAddCategoryMutation();
  const [editCategoryMutation] = useEditCategoryMutation();
  const [deleteCategoryMutation] = useDeleteCategoryMutation();

  // Handlers
  const showModal = () => {
    setIsModalOpen(true);
    setSelectedCategory(null);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (!selectedCategory) {
        await addCategory(values).unwrap();
      } else {
        await editCategoryMutation({ id: selectedCategory, ...values }).unwrap();
        setSelectedCategory(null);
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

  const editCategory = (category) => {
    setSelectedCategory(category.id);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const deleteCategory = async (id, data) => {
    try {
      for (const itemId of data) {
        await axios.delete(`${ENDPOINT}/categories/${id}/products/${itemId}`);
      }

      await deleteCategoryMutation(id).unwrap();

      message.success("Category and its products deleted successfully");

      refetch();
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
      title: "Products",
      dataIndex: "items",
      key: "items",
      render: (i, data) => {
        const text = "A lot of products:  " + i.length;
        
        return (
          <Tooltip placement="left" title={text}>

            <Link to={`/category/${data.id}`}>View products</Link>
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (i) => {
        const data = i.items.map((item) => +item.id);
        return (
          <Flex gap="middle">
            <Button onClick={() => editCategory(i)} type="primary">
              Edit
            </Button>
            <Popconfirm
              title="Delete category"
              description={
                <>
                  Are you sure to delete this category? <br />
                  All products in this category will also be deleted.
                </>
              }
              onConfirm={() => deleteCategory(i.id, data)}
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

  // Render
  return (
    <Fragment>
      <Table
        title={() => (
          <Flex vertical={true} gap="middle">
            <Flex align="center" justify="space-between">
              <h1>Categories ({categories?.length})</h1>
              <Button type="primary" onClick={showModal}>
                Add Category
              </Button>
            </Flex>
            <Input placeholder="Searching category" onChange={onSearch} value={search} />
          </Flex>
        )}
        columns={columns}
        dataSource={categories}
        rowKey={"id"}
        pagination={false}
        loading={isLoading}
      />
      <Modal
        title={!selectedCategory ? "Add Category" : "Edit Category"}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        okText={!selectedCategory ? "Add category" : "Edit category"}
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
            label="Category name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
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
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ProductsPage;
