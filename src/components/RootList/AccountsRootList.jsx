import React, { lazy } from "react";
import icons from "../../contents/Icons";
import AccountsIcon from "../../assets/icons/Accounts";
import CreateSalesReturn from "../../pages/Accounts/Sales/SaleReturn/CreateSalesReturn";
import CreateSalesInvoice from "../../pages/Accounts/Sales/SaleInvoice/CreateSalesInvoice";
import Credit from "../../pages/Accounts/Transaction/Credit/Credit";
import Debit from "../../pages/Accounts/Transaction/Debit/Debit";
import Expense from "../../pages/Accounts/Transaction/Expense/Expense";
import TransactionList from "../../pages/Accounts/TransactionMaster/TransactionList";
import AccountsList from "../../pages/Accounts/AccountsMaster/AccountsList";
import MajorandSubHead from "../../pages/Accounts/Account/MajorandSubHead";
import NatureOfAccount from "../../pages/Accounts/Account/NatureOfAccount";

const CreatePurchaseQuotation = lazy(() => import("../../pages/Accounts/Purchase/PurchaseQuotation/CreatePurchaseQuotation"));
const PurchaseOrder = lazy(() => import("../../pages/Accounts/Purchase/PurchaseOrder/PurchaseOrder"));
const PurchaseInvoice = lazy(() => import("../../pages/Accounts/Purchase/PurchaseInvoice/PurchaseInvoice"));
const PurchaseReturn = lazy(() => import("../../pages/Accounts/Purchase/PurchaseReturn/PurchaseReturn"));
const PurchaseQuotation = lazy(() => import("../../pages/Accounts/Purchase/PurchaseQuotation/PurchaseQuotation"));
const CreateSalesOrder = lazy(() => import("../../pages/Accounts/Sales/SaleOrder/CreateSalesOrder"));
const CreatePurchaseOrder = lazy(() => import("../../pages/Accounts/Purchase/PurchaseOrder/CreatePurchaseOrder"));
const CreatePurchaseInvoice = lazy(() => import("../../pages/Accounts/Purchase/PurchaseInvoice/CreatePurchaseInvoice"));
const CreatePurchaseReturn = lazy(() => import("../../pages/Accounts/Purchase/PurchaseReturn/CreatePurchaseReturn"));

const Accounts = lazy(() => import("../../pages/Accounts/Sales/SaleQuotation/SalesQuotation"));
const SaleOrder = lazy(() => import("../../pages/Accounts/Sales/SaleOrder/SalesOrder"));
const CreateSalesQuotation = lazy(() => import("../../pages/Accounts/Sales/SaleQuotation/CreateSalesQuotation"));
const SaleInvoice = lazy(() => import("../../pages/Accounts/Sales/SaleInvoice/SaleInvoice"));
const SaleReturn = lazy(() => import("../../pages/Accounts/Sales/SaleReturn/SalesReturn"));

export const AccountsRootList = {
    path: "accounts",
    icon: <img src={AccountsIcon} alt="AccountsIcon" width="18" height="18" />,
    children: [
        {
            index: true,
            path: "sale/sale-quotation",
            element: <Accounts />,
        },
        {
            index: true,
            path: "sale/create-sale-quotation",
            element: <CreateSalesQuotation />,
        },
        {
            path: "sale/sale-order",
            element: <SaleOrder />,
        },
        {
            index: true,
            path: "sale/create-sale-order",
            element: <CreateSalesOrder />,
        },
        {
            path: "sale/sale-invoice",
            element: <SaleInvoice />,
        },
        {
            index: true,
            path: "sale/create-sale-invoice",
            element: <CreateSalesInvoice />,
        },
        {
            path: "sale/sale-return",
            element: <SaleReturn />,
        },
        {
            index: true,
            path: "sale/create-sale-return",
            element: <CreateSalesReturn />,
        },
        {
            index: true,
            path: "purchase/purchase-quotation",
            element: <PurchaseQuotation />,
        },
        {
            index: true,
            path: "purchase/create-purchase-quotation",
            element: <CreatePurchaseQuotation />,
        },
        {
            path: "purchase/purchase-order",
            element: <PurchaseOrder />,
        },
        {
            index: true,
            path: "purchase/create-purchase-order",
            element: <CreatePurchaseOrder />,
        },
        {
            path: "purchase/purchase-invoice",
            element: <PurchaseInvoice />,
        },
        {
            index: true,
            path: "purchase/create-purchase-invoice",
            element: <CreatePurchaseInvoice />,
        },
        {
            path: "purchase/purchase-return",
            element: <PurchaseReturn />,
        },
        {
            index: true,
            path: "purchase/create-purchase-return",
            element: <CreatePurchaseReturn />,
        },
        {
            index: true,
            path: "transactions/credit",
            element: <Credit />,
        },
        {
            index: true,
            path: "transactions/create-credit",
            element: <CreatePurchaseQuotation />,
        },
        {
            path: "transactions/debit",
            element: <Debit />,
        },
        {
            index: true,
            path: "transactions/create-debit",
            element: <CreatePurchaseOrder />,
        },
        {
            path: "transactions/expense",
            element: <Expense />,
        },
        {
            index: true,
            path: "transactions/create-expense",
            element: <CreatePurchaseInvoice />,
        },     
        {
                
            index: true,
            path: "transactions-master",
            element: <TransactionList />,
        },               
        {
                
            index: true,
            path: "natureofaccount",
            element: <NatureOfAccount />,
        },        
        {
                
            index: true,
            path: "account/major&subheads",
            element: <MajorandSubHead />,
        },        
        {
                
            index: true,
            path: "accounts-master",
            element: <AccountsList />,
        },        
    ],
};

export const AccountsNavList = {
    title: "Accounts",
    id: "accounts",
    icon: React.cloneElement(icons.customIcon, { size: 18 }),
    submenu: [
        {
            title: "Sales",
            id: "Sales",
            submenu: [
                { title: " Sale Quotation", id: "sale-quotation", to: "/user/accounts/sale/sale-quotation" },
                { title: "Sale Order", id: "sale-order", to: "/user/accounts/sale/sale-order" },
                { title: "Sale Invoice", id: "sale-invoice", to: "/user/accounts/sale/sale-invoice" },
                { title: "Sale Return", id: "sale-return", to: "/user/accounts/sale/sale-return" },
            ]
        },
        {
            title: "Purchase",
            id: "purchase",
            submenu: [
                { title: " Purchase Quotation", id: "purchase-quotation", to: "/user/accounts/purchase/purchase-quotation" },
                { title: "Purchase Order", id: "purchase-order", to: "/user/accounts/purchase/purchase-order" },
                { title: "Purchase Invoice", id: "purchase-invoice", to: "/user/accounts/purchase/purchase-invoice" },
                { title: "Purchase Return", id: "purchase-return", to: "/user/accounts/purchase/purchase-return" },
            ]
        },
        {
            title: "Transactions",
            id: "transactions",
            submenu: [
                { title: "Credit", id: "credit", to: "/user/accounts/transactions/credit" },
                { title: "Debit", id: "debit", to: "/user/accounts/transactions/debit" },
                { title: "Expense", id: "expense", to: "/user/accounts/transactions/expense" },            ]
        },
        { title: "Transaction Master", id: "transactions-master", to: "/user/accounts/transactions-master" },
        {   
            title: "Accounts", 
            id: "accounts", 
            submenu: [
                { title: "NatureOfAccount", id: "natureofaccount", to: "/user/accounts/natureofaccount" },
                { title: "Major & SubHead", id: "heads", to: "/user/accounts/account/major&subheads" },
            ]
        },
        { title: "Accounts Master", id: "accounts-master", to: "/user/accounts/accounts-master" },

    ],
};