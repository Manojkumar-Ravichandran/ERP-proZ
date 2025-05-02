import React, { lazy } from "react";
import icons from "../../contents/Icons";
import WastageScrubList from "../../pages/Inventory/WastageScrub/WastageScrubList";
import MaterialRequestList from "../../pages/Inventory/MaterialRequest/MaterialRequestList";

const Category = lazy(() =>
  import("../../pages/Inventory/Materials/Category/Category")
);
const AddCategory = lazy(() =>
  import("../../pages/Inventory/Materials/Category/AddCategory")
);
const SubCategory = lazy(() =>
  import("../../pages/Inventory/Materials/SubCategory/SubCategory")
);
const AddSubCategory = lazy(() =>
  import("../../pages/Inventory/Materials/SubCategory/AddSubCategory")
);
const MaterialInList = lazy(() =>
  import("../../pages/Inventory/Materials/MaterialIn/MaterilaInList")
);
const MaterialOutList = lazy(() =>
  import("../../pages/Inventory/Materials/MaterialOut/MaterialOutList")
);

const MaterialInAdd = lazy(() =>
  import("../../pages/Inventory/Materials/MaterialIn/MaterialInAdd")
);

const Item = lazy(() => import("../../pages/Inventory/Materials/Item/Item"));
const AddItem = lazy(() =>
  import("../../pages/Inventory/Materials/Item/AddItem")
);
const EditItem = lazy(() =>
  import("../../pages/Inventory/Materials/Item/EditItem")
);
const DashboardInventory = lazy(() =>
  import("../../pages/Inventory/Dashboard/Dashboard")
);
const Purchase = lazy(() => import("../../pages/Inventory/Purchase/Purchase"));
const MasterList = lazy(() =>
  import("../../pages/Inventory/Master/MasterList")
);
const AddPurchase = lazy(() =>
  import("../../pages/Inventory/Purchase/AddPurchase")
);
const MasterCreate = lazy(() =>
  import("../../pages/Inventory/Master/MasterCreate")
);
const MasterDetail = lazy(() =>
  import("../../pages/Inventory/Master/MasterDetail")
);
const AssetsList = lazy(() =>
  import("../../pages/Inventory/Assets/AssetsList")
);
const LendAssetsList = lazy(() =>
  import("../../pages/Inventory/Assets/LendAssetsList")
);
const StockEntryList = lazy(() =>
  import("../../pages/Inventory/StockEntry/StockEntryList")
);
const ProductList = lazy(() =>
  import("../../pages/Inventory/Product/ProductList")
);
const MaterialTransferList = lazy(() =>
  import("../../pages/Inventory/MaterialTransfer/MaterialTransferList")
);

export const InventoryRootList = {
  path: "inventory/",
  children: [
    {
      path: "material/",
      children: [
        {
          path: "category/",
          children: [
            {
              index: true,
              element: <Category />,
            },
            {
              path: "add-category",
              element: <AddCategory />,
            },
          ],
        },
        {
          path: "subcategory/",
          children: [
            {
              index: true,
              element: <SubCategory />,
            },
            {
              path: "add-subcategory",
              element: <AddSubCategory />,
            },
          ],
        },
        {
          path: "materialInOut/",
          children: [
            {
              path: "in/",
              element: <MaterialInList />,
            },
            {
              path: "in-add",
              element: <MaterialInAdd />,
            },
            {
              path: "out/",
              element: <MaterialOutList />,
            },
          ],
        },
        {
          path: "item/",
          children: [
            {
              index: true,
              element: <Item />,
            },
            {
              path: "add-item",
              element: <AddItem />,
            },
            {
              path: "edit-item",
              element: <EditItem />,
            },
          ],
        },
      ],
    },
    {
      path: "dashboard/",
      children: [
        {
          index: true,
          element: <DashboardInventory />,
        },
      ],
    },
    {
      path: "purchase/",
      children: [
        {
          index: true,
          element: <Purchase />,
        },
        {
          path: "add-purchase",
          element: <AddPurchase />,
        },
      ],
    },
    {
      path: "Master/",
      children: [
        {
          index: true,
          element: <MasterList />,
        },
        {
          path: "create-location",
          element: <MasterCreate />,
        },
        {
          path: "detail-location/:uuid",
          element: <MasterDetail />,
        },
      ],
    },
    {
      path: "assets/",
      children: [
        {
          index: true,
          element: <AssetsList />,
        },
        {
          path: "lend-assets",
          element: <LendAssetsList />,
        }
      ]
    },
    {
      path: "stock-entry/",
      children: [
        {
          index: true,
          element: <StockEntryList />,
        },
      ],
    },
    {
      path: "product/",
      children: [
        {
          index: true,
          element: <ProductList />,
        },
      ],
    },
    {
      path: "material-transfer",
      children: [
        {
          index: true,
          element: <MaterialTransferList />,
        },
      ],
    },
    {
      path: "wastage-scrub/",
      children: [
        {
          index: true,
          element: <WastageScrubList />,
        },
      ],
    },
    {
      path: "material-request/",
      children: [
        {
          index: true,
          element: <MaterialRequestList />,
        },
      ],
    },
  ],
};

export const InventoryNavList = {
  title: "Inventory",
  icon: React.cloneElement(icons?.inventoryIcon, { size: 18 }),
  id: "inventory",
  submenu: [
    {
      title: "Dashboard",
      id: "dashboard",
      to: "/user/inventory/dashboard",
    },
    { title: "Inventory", id: "master", to: "/user/inventory/master" },
   
    {
      title: "Material",
      id: "material",
      submenu: [
       
        {
          title: "Category",
          id: "category",
          to: "/user/inventory/material/category",
        },
        {
          title: "Sub Category",
          id: "subCategory",
          to: "/user/inventory/material/subcategory",
        },
        {
          title: "Item",
          id: "item",
          to: "/user/inventory/material/item",
        },
        // {
        //   title: "Item",
        //   id: "item",
        //   to: "/user/inventory/material/item",
        // },
        {
          title: "Material In",
          id: "materialInOut",
          to: "/user/inventory/material/materialInOut/in",
        },
        {
          title: "Material Out",
          id: "materialInOut",
          to: "/user/inventory/material/materialInOut/out",
        },
      ],
    },
    { title: "Assets", id: "assets", to: "/user/inventory/assets" },
    {
      title: "Lend History",
      id: "assets",
      to: "/user/inventory/assets/lend-assets",
    },
    { title: "Material Transfer", id: "material-transfer", to: "/user/inventory/material-transfer", },
    // { title: "Purchase", id: "purchase", to: "/user/inventory/purchase" },
    { title: "Stock Entry", id: "stock-entry", to: "/user/inventory/stock-entry" },
    // { title: "Product", id: "product", to: "/user/inventory/product" },
    { title: "Wastage Scrab", id: "wastage-scrub", to: "/user/inventory/wastage-scrub" },
    { title: "Material Request", id: "material-request", to: "/user/inventory/material-request" }
  ],
};
