"use client";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { Menu, MenuItem, IconButton } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function User() {
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
    // FIXME: 修正下拉選單位置
    <div>
      {user && user !== -1 ? (
        <IconButton
          onClick={handleClick}
          sx={{
            color: "white", // 確保 icon 顯示出來
            zIndex: 1200,
          }}
        >
          <FaRegUser size={20} />
        </IconButton>
      ) : (
        <Link href="/member/login" className="header-cart a">
          <FaRegUser size={20} color="white" />
        </Link>
      )}

      <Menu
        anchorEl={anchorEl} // 讓選單靠著按鈕顯示
        open={open} // 控制開關
        onClose={handleClose} // 點外面就關閉
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
            zIndex: 1200,
            minWidth: 130,
          },
        }}
      >
        {user ? (
          [
            <MenuItem key="favorite" onClick={handleClose}>
              <Link href="/member/favorite">我的收藏</Link>
            </MenuItem>,
            <MenuItem key="account" onClick={handleClose}>
              <Link href="/member/account">帳戶設定</Link>
            </MenuItem>,
            <MenuItem
              key="logout"
              onClick={() => {
                logout();
                handleClose();
              }}
              sx={{ color: "red" }}
            >
              登出
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleClose}>
            <Link href="/member/login">登入</Link>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
