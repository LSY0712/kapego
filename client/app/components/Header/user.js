"use client";
import { useState } from "react";
import {
  FaRegUser,
  FaHeart,
  FaUserCog,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log("當前用戶狀態:", user);

  return (
    <div>
      {/* 已登入：顯示 IconButton，未登入：顯示 Link */}
      {user && user !== -1 ? (
        <IconButton
          onClick={handleClick}
          sx={{
            color: "#fff",
            p: 1,
            zIndex: 1200,
          }}
        >
          <FaRegUser size={18} />
        </IconButton>
      ) : (
        <Link href="/member/login" className="header-cart a">
          <IconButton sx={{ color: "#fff" }}>
            <FaRegUser size={20} />
          </IconButton>
        </Link>
      )}

      {/* 下拉選單 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
            minWidth: 180,
            zIndex: 1200,
            p: 1,
          },
        }}
      >
        {user
          ? [
              <MenuItem onClick={handleClose} sx={{ py: 1 }} key="account">
                <ListItemIcon>
                  <FaUserCog size={16} />
                </ListItemIcon>
                <Link
                  href="/member/account"
                  className="text-decoration-none text-dark"
                >
                  帳戶設定
                </Link>
              </MenuItem>,

              <MenuItem onClick={handleClose} sx={{ py: 1 }} key="order">
                <ListItemIcon>
                  <FaClipboardList size={16} />
                </ListItemIcon>
                <Link
                  href="/member/order"
                  className="text-decoration-none text-dark"
                >
                  我的訂單
                </Link>
              </MenuItem>,

              <MenuItem onClick={handleClose} sx={{ py: 1 }} key="favorite">
                <ListItemIcon>
                  <FaHeart size={16} />
                </ListItemIcon>
                <Link
                  href="/member/favorite"
                  className="text-decoration-none text-dark"
                >
                  我的收藏
                </Link>
              </MenuItem>,

              <Divider sx={{ my: 1 }} key="divider" />,

              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
                sx={{ color: "red", py: 1 }}
                key="logout"
              >
                <ListItemIcon>
                  <FaSignOutAlt size={16} color="red" />
                </ListItemIcon>
                <span>登出</span>
              </MenuItem>,
            ]
          : [
              <MenuItem onClick={handleClose} key="login">
                <ListItemIcon>
                  <FaRegUser size={16} />
                </ListItemIcon>
                <Link
                  href="/member/login"
                  className="text-decoration-none text-dark"
                >
                  登入
                </Link>
              </MenuItem>,
            ]}
      </Menu>
    </div>
  );
}
