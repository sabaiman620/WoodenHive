export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "office", label: "Office" },
      { id: "kitchen", label: "Kitchen" },
      { id: "gifts", label: "Gifts" },
      { id: "accessories", label: "Accessories" },
      { id: "home", label: "Home" },
    ],
  },
  {
    label: "Actual Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter actual price",
  },
  {
    label: "Discounted Price (optional)",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter discounted price (optional)",
  },
  {
    label: "Size (single)",
    name: "size",
    componentType: "input",
    type: "text",
    placeholder: "Enter size (e.g. M)",
  },
  {
    label: "Colors (comma separated)",
    name: "colors",
    componentType: "input",
    type: "text",
    placeholder: "Enter colors separated by commas (e.g. red,green)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "office",
    label: "Office",
    path: "/shop/listing",
  },
  {
    id: "kitchen",
    label: "Kitchen",
    path: "/shop/listing",
  },
  {
    id: "gifts",
    label: "Gifts",
    path: "/shop/listing",
  },
  
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  office: "Office",
  kitchen: "Kitchen",
  gifts: "Gifts",
  accessories: "Accessories",
  home: "Home",
};

export const filterOptions = {
  category: [
    { id: "office", label: "Office" },
    { id: "kitchen", label: "Kitchen" },
    { id: "gifts", label: "Gifts" },
    { id: "accessories", label: "Accessories" },
    { id: "home", label: "Home" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
