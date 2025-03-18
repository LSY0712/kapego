-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-03-18 13:26:10
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `project`
--

-- --------------------------------------------------------

--
-- 資料表結構 `carts`
--

CREATE TABLE `carts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `status` enum('active','checked_out','abandoned') NOT NULL DEFAULT 'active',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 60, 'checked_out', '2025-03-16 22:37:10', '2025-03-17 03:38:04'),
(2, 60, 'active', '2025-03-17 03:38:04', '2025-03-17 03:38:04'),
(3, 62, 'checked_out', '2025-03-17 14:43:33', '2025-03-17 15:12:08'),
(4, 62, 'checked_out', '2025-03-17 15:12:08', '2025-03-17 15:28:06'),
(5, 62, 'checked_out', '2025-03-17 15:28:06', '2025-03-17 16:13:20'),
(6, 62, 'active', '2025-03-17 16:13:20', '2025-03-17 16:13:20'),
(7, 61, 'active', '2025-03-17 16:27:23', '2025-03-17 16:27:23'),
(8, 64, 'checked_out', '2025-03-17 16:42:21', '2025-03-17 16:46:50'),
(9, 64, 'checked_out', '2025-03-17 16:46:50', '2025-03-17 16:47:55'),
(10, 64, 'active', '2025-03-17 16:47:55', '2025-03-17 16:47:55');

-- --------------------------------------------------------

--
-- 資料表結構 `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `cart_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`, `createdAt`, `updatedAt`) VALUES
(12, 1, 2, 1, '2025-03-17 03:14:05', '2025-03-17 03:14:05'),
(13, 1, 6, 1, '2025-03-17 03:14:07', '2025-03-17 03:14:07'),
(14, 1, 8, 1, '2025-03-17 03:14:08', '2025-03-17 03:14:08'),
(15, 2, 8, 1, '2025-03-17 05:08:45', '2025-03-17 05:08:45'),
(16, 2, 4, 7, '2025-03-17 05:30:28', '2025-03-17 05:30:37'),
(17, 3, 60, 1, '2025-03-17 15:01:11', '2025-03-17 15:01:11'),
(18, 3, 58, 1, '2025-03-17 15:01:18', '2025-03-17 15:01:18'),
(19, 3, 2, 2, '2025-03-17 15:11:48', '2025-03-17 15:11:54'),
(20, 3, 1, 1, '2025-03-17 15:11:50', '2025-03-17 15:11:50'),
(21, 3, 4, 1, '2025-03-17 15:11:56', '2025-03-17 15:11:56'),
(22, 3, 8, 1, '2025-03-17 15:11:57', '2025-03-17 15:11:57'),
(23, 4, 1, 2, '2025-03-17 15:27:55', '2025-03-17 15:28:01'),
(24, 4, 2, 2, '2025-03-17 15:27:55', '2025-03-17 15:28:02'),
(25, 4, 3, 2, '2025-03-17 15:27:56', '2025-03-17 15:28:03'),
(26, 5, 2, 1, '2025-03-17 16:13:10', '2025-03-17 16:13:10'),
(27, 5, 8, 1, '2025-03-17 16:13:14', '2025-03-17 16:13:14'),
(28, 8, 26, 1, '2025-03-17 16:46:39', '2025-03-17 16:46:39'),
(29, 8, 25, 3, '2025-03-17 16:46:40', '2025-03-17 16:46:41'),
(30, 8, 1, 1, '2025-03-17 16:46:44', '2025-03-17 16:46:44'),
(31, 8, 2, 1, '2025-03-17 16:46:44', '2025-03-17 16:46:44'),
(32, 9, 1, 1, '2025-03-17 16:47:49', '2025-03-17 16:47:49'),
(33, 9, 2, 1, '2025-03-17 16:47:50', '2025-03-17 16:47:50'),
(34, 9, 3, 1, '2025-03-17 16:47:51', '2025-03-17 16:47:51');

-- --------------------------------------------------------

--
-- 資料表結構 `color`
--

CREATE TABLE `color` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `color_code` varchar(7) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `color`
--

INSERT INTO `color` (`id`, `name`, `color_code`, `createdAt`, `updatedAt`) VALUES
(1, '黑色', '#000000', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, '藍色', '#0000FF', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, '紅色', '#FF0000', '2025-02-14 15:23:58', '2025-02-14 15:23:58');

-- --------------------------------------------------------

--
-- 資料表結構 `favorites`
--

CREATE TABLE `favorites` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(87, 56, 1, '2025-03-16 13:06:49'),
(88, 56, 2, '2025-03-16 13:27:58'),
(89, 60, 2, '2025-03-16 14:19:55'),
(90, 60, 9, '2025-03-16 16:40:11'),
(91, 60, 8, '2025-03-16 18:52:05'),
(92, 60, 12, '2025-03-16 18:52:13'),
(94, 62, 6, '2025-03-17 07:01:13'),
(95, 62, 2, '2025-03-17 08:11:45');

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `total_items` int(50) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','canceled') NOT NULL DEFAULT 'pending',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_time` datetime DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `total_items`, `status`, `createdAt`, `updatedAt`, `payment_method`, `transaction_id`, `payment_time`, `payment_status`) VALUES
(1, 60, 6300.00, 0, 'paid', '2025-02-14 15:23:58', '2025-02-14 15:23:58', NULL, NULL, NULL, 'pending'),
(2, 60, 7500.00, 0, 'pending', '2025-02-14 15:23:58', '2025-02-14 15:23:58', NULL, NULL, NULL, 'pending'),
(3, 60, 7500.00, 0, 'pending', '2025-02-16 18:11:43', '2025-02-16 18:11:43', NULL, NULL, NULL, 'pending'),
(5, 60, 1800.00, 0, 'paid', '2025-03-17 03:38:04', '2025-03-17 03:38:04', NULL, NULL, NULL, 'pending'),
(6, 62, 3200.00, 0, 'paid', '2025-03-17 15:12:08', '2025-03-17 15:12:08', NULL, NULL, NULL, 'pending'),
(7, 62, 4400.00, 6, 'paid', '2025-03-17 15:28:06', '2025-03-17 15:28:06', NULL, NULL, NULL, 'pending'),
(8, 62, 1200.00, 2, 'paid', '2025-03-17 16:13:20', '2025-03-17 16:13:20', NULL, NULL, NULL, 'pending'),
(9, 64, 4600.00, 6, 'paid', '2025-03-17 16:46:50', '2025-03-17 16:46:50', NULL, NULL, NULL, 'pending'),
(10, 64, 2200.00, 3, 'paid', '2025-03-17 16:47:55', '2025-03-17 16:47:55', NULL, NULL, NULL, 'pending');

-- --------------------------------------------------------

--
-- 資料表結構 `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(100) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `createdAt`) VALUES
(5, 5, 2, 1, 600.00, '2025-03-17 03:38:04'),
(6, 5, 6, 1, 600.00, '2025-03-17 03:38:04'),
(7, 5, 8, 1, 600.00, '2025-03-17 03:38:04'),
(8, 6, 2, 2, 600.00, '2025-03-17 15:12:08'),
(9, 6, 1, 1, 800.00, '2025-03-17 15:12:08'),
(10, 6, 4, 1, 600.00, '2025-03-17 15:12:08'),
(11, 6, 8, 1, 600.00, '2025-03-17 15:12:08'),
(12, 7, 1, 2, 800.00, '2025-03-17 15:28:06'),
(13, 7, 2, 2, 600.00, '2025-03-17 15:28:06'),
(14, 7, 3, 2, 800.00, '2025-03-17 15:28:06'),
(15, 8, 2, 1, 600.00, '2025-03-17 16:13:20'),
(16, 8, 8, 1, 600.00, '2025-03-17 16:13:20'),
(17, 9, 26, 1, 800.00, '2025-03-17 16:46:50'),
(18, 9, 25, 3, 800.00, '2025-03-17 16:46:50'),
(19, 9, 1, 1, 800.00, '2025-03-17 16:46:50'),
(20, 9, 2, 1, 600.00, '2025-03-17 16:46:50'),
(21, 10, 1, 1, 800.00, '2025-03-17 16:47:55'),
(22, 10, 2, 1, 600.00, '2025-03-17 16:47:55'),
(23, 10, 3, 1, 800.00, '2025-03-17 16:47:55');

-- --------------------------------------------------------

--
-- 資料表結構 `order_shipping_info`
--

CREATE TABLE `order_shipping_info` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `shipping_address` text NOT NULL,
  `shipping_method` enum('home_delivery','convenience_store') NOT NULL,
  `store_id` varchar(50) DEFAULT NULL,
  `store_name` varchar(100) DEFAULT NULL,
  `store_address` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `otp`
--

CREATE TABLE `otp` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expires_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `otp`
--

INSERT INTO `otp` (`id`, `email`, `token`, `created_at`, `expires_at`) VALUES
(4, 'diveintest1@gmail.com', '584861', '2025-03-17 16:10:56.000', '2025-03-17 17:15:14.006');

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `price` int(10) NOT NULL,
  `stock` int(10) UNSIGNED DEFAULT 0,
  `img` varchar(255) DEFAULT NULL,
  `series` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `stock`, `img`, `series`, `createdAt`, `updatedAt`) VALUES
(1, 'R2FFR0170', '', 800, 0, NULL, 2, '2025-02-14 15:23:58', '2025-03-13 13:41:53'),
(2, 'B2WDR0157A', '', 600, 0, NULL, 2, '2025-02-14 15:23:58', '2025-03-13 13:41:53'),
(3, 'R2CDR0126', '', 800, 0, NULL, 2, '2025-02-14 15:23:58', '2025-03-13 13:41:53'),
(4, 'D1KT3032', NULL, 600, 0, NULL, 1, '2025-03-13 17:21:49', '2025-03-13 17:21:49'),
(5, 'D1KU3032', NULL, 600, 0, NULL, 1, '2025-03-13 17:22:04', '2025-03-13 17:24:08'),
(6, 'D1LX1234', NULL, 600, 0, NULL, 1, '2025-03-13 17:24:54', '2025-03-13 17:24:54'),
(7, 'D1LY1234', NULL, 600, 0, NULL, 1, '2025-03-13 17:24:54', '2025-03-13 17:24:54'),
(8, 'D1KW3032', ' LIGHT SOURCE\r\n 30×0.07W', 600, 0, '', 1, '2025-03-13 17:30:47', '2025-03-13 17:31:02'),
(9, ' D1CN1434', ' LIGHT SOURCE\r\n 14×0.5W ', 600, 0, NULL, 1, '2025-03-13 17:30:47', '2025-03-13 17:30:47'),
(10, 'B0BRC0226', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(11, 'B0BRC0326', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(12, 'B0BRC0426', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(13, 'B0BSU0569', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(14, 'B0BSU0469', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(15, 'B0BSU0369', 'Bollard Light', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(16, 'B0BSZ0569', 'Bollard Light', 800, 10, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(17, 'B0BSZ0469', 'Bollard Light', 800, 10, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(18, 'B0BRZ0226', 'Bollard Light', 800, 10, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(19, 'B0BRZ0326', 'Bollard Light', 800, 10, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:52:50'),
(20, 'XB2CFR0157F', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(21, 'XB2DFR0158F', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(22, 'XB2EFR0656', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(23, 'XB2FFR0956', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(24, 'XB2GFR1257', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(25, 'XB2KFR1258', 'Surface Mount Wall Light', 800, 10, NULL, 2, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(26, 'R2CFR0125F', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(27, 'R2DFR0126F', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(28, 'R2EFR0129', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(29, 'R2FFR0170', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(30, 'R2GFR0173', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(31, 'R2KFR0176', 'Spotlight', 800, 10, NULL, 3, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(32, 'I1IGL3001', 'Inground Light', 900, 12, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(33, 'I1IGL3002', 'Inground Light', 900, 12, NULL, 4, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(34, 'P1RPL4001', 'Recessed Pool Light', 1200, 8, NULL, 5, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(35, 'P1RPL4002', 'Recessed Pool Light', 1200, 8, NULL, 5, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(36, 'U1USL5001', 'Underwater Spotlight', 1500, 6, NULL, 6, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(37, 'U1USL5002', 'Underwater Spotlight', 1500, 6, NULL, 6, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(38, 'L1LWW6001', 'Linear Wall Washer', 1700, 5, NULL, 7, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(39, 'L1LWW6002', 'Linear Wall Washer', 1700, 5, NULL, 7, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(40, 'G1SGP7001', 'Street & Garden Pole Light', 2000, 3, NULL, 8, '2025-03-13 19:51:48', '2025-03-13 19:51:48'),
(41, 'G1SGP7002', 'Street & Garden Pole Light', 2000, 3, NULL, 8, '2025-03-13 19:51:48', '2025-03-13 19:51:48');

-- --------------------------------------------------------

--
-- 資料表結構 `product_details`
--

CREATE TABLE `product_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_images`
--

CREATE TABLE `product_images` (
  `id` int(10) UNSIGNED NOT NULL COMMENT '圖片編號',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT '對應商品ID',
  `image_path` varchar(255) NOT NULL COMMENT '圖片路徑',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序（輪播、縮圖用）',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '上傳時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='商品圖片表';

--
-- 傾印資料表的資料 `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`, `sort_order`, `created_at`) VALUES
(1, 4, '/img/product/4/main.png', 1, '2025-03-13 11:59:11'),
(2, 5, '/img/product/5/main.png', 1, '2025-03-13 11:59:11'),
(3, 6, '/img/product/6/main.png', 1, '2025-03-13 11:59:11'),
(4, 7, '/img/product/7/main.png', 1, '2025-03-13 11:59:11'),
(5, 8, '/img/product/8/main.png', 1, '2025-03-13 11:59:11'),
(6, 9, '/img/product/9/main.png', 1, '2025-03-13 11:59:11'),
(7, 1, '/img/product/1/main.png', 1, '2025-03-13 11:59:11'),
(8, 2, '/img/product/2/main.png', 1, '2025-03-13 11:59:11'),
(9, 3, '/img/product/3/main.png', 1, '2025-03-13 11:59:11'),
(10, 20, '/img/product/20/main.png', 1, '2025-03-13 11:59:11'),
(11, 21, '/img/product/21/main.png', 1, '2025-03-13 11:59:11'),
(12, 22, '/img/product/22/main.png', 1, '2025-03-13 11:59:11'),
(13, 23, '/img/product/23/main.png', 1, '2025-03-13 11:59:11'),
(14, 24, '/img/product/24/main.png', 1, '2025-03-13 11:59:11'),
(15, 25, '/img/product/25/main.png', 1, '2025-03-13 11:59:11'),
(16, 10, '/img/product/10/main.png', 1, '2025-03-13 11:59:11'),
(17, 11, '/img/product/11/main.png', 1, '2025-03-13 11:59:11'),
(18, 12, '/img/product/12/main.png', 1, '2025-03-13 11:59:11'),
(19, 13, '/img/product/13/main.png', 1, '2025-03-13 11:59:11'),
(20, 14, '/img/product/14/main.png', 1, '2025-03-13 11:59:11'),
(21, 15, '/img/product/15/main.png', 1, '2025-03-13 11:59:11'),
(22, 26, '/img/product/26/main.png', 1, '2025-03-13 11:59:11'),
(23, 27, '/img/product/27/main.png', 1, '2025-03-13 11:59:11'),
(24, 28, '/img/product/28/main.png', 1, '2025-03-13 11:59:11'),
(25, 29, '/img/product/29/main.png', 1, '2025-03-13 11:59:11'),
(26, 30, '/img/product/30/main.png', 1, '2025-03-13 11:59:11'),
(27, 31, '/img/product/31/main.png', 1, '2025-03-13 11:59:11'),
(28, 16, '/img/product/16/main.png', 1, '2025-03-13 11:59:11'),
(29, 17, '/img/product/17/main.png', 1, '2025-03-13 11:59:11'),
(30, 18, '/img/product/18/main.png', 1, '2025-03-13 11:59:11'),
(31, 19, '/img/product/19/main.png', 1, '2025-03-13 11:59:11'),
(32, 32, '/img/product/32/main.png', 1, '2025-03-13 11:59:11'),
(33, 33, '/img/product/33/main.png', 1, '2025-03-13 11:59:11'),
(34, 34, '/img/product/34/main.png', 1, '2025-03-13 11:59:11'),
(35, 35, '/img/product/35/main.png', 1, '2025-03-13 11:59:11'),
(36, 36, '/img/product/36/main.png', 1, '2025-03-13 11:59:11'),
(37, 37, '/img/product/37/main.png', 1, '2025-03-13 11:59:11'),
(38, 38, '/img/product/38/main.png', 1, '2025-03-13 11:59:11'),
(39, 39, '/img/product/39/main.png', 1, '2025-03-13 11:59:11'),
(40, 40, '/img/product/40/main.png', 1, '2025-03-13 11:59:11'),
(41, 41, '/img/product/41/main.png', 1, '2025-03-13 11:59:11');

-- --------------------------------------------------------

--
-- 資料表結構 `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `size`
--

CREATE TABLE `size` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `size`
--

INSERT INTO `size` (`id`, `name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL');

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `google_uid` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` int(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `birthday` date NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` varchar(50) NOT NULL,
  `updated_at` varchar(50) NOT NULL,
  `level_id` int(11) NOT NULL,
  `emergency_contact` varchar(50) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `is_certify` int(11) NOT NULL,
  `is_deleted` int(11) NOT NULL,
  `manager` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `google_uid`, `name`, `phone`, `gender`, `email`, `password`, `birthday`, `address`, `created_at`, `updated_at`, `level_id`, `emergency_contact`, `emergency_phone`, `img`, `is_certify`, `is_deleted`, `manager`) VALUES
(1, '0', '王小明', '0912322658', NULL, 'ming0908@test.com', 'Ming0908', '2000-09-08', '桃園市中壢區新生路一段421號', '2024-11-22 11:24:32', '2024-12-03 14:59:35', 2, NULL, NULL, '', 0, 1, 0),
(2, '\0tjd', '李佳穎', '0928374629', NULL, 'jiaying0905@test.com', 'Jia0905', '1995-05-20', '台北市大安區和平東路二段35號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(3, '0', '張志豪', '0987123456', NULL, 'zhihao0803@test.com', 'Zhi0803', '1987-03-12', '高雄市左營區自由二路102號', '2024-11-22 11:24:32', '2024-12-03 11:19:36', 1, NULL, NULL, '', 0, 0, 0),
(4, '0', '陳美玲', '0958674213', NULL, 'meiling0615@test.com', 'Mei0615', '1979-06-15', '台中市西屯區福星路350巷45號', '2024-11-22 11:24:32', '', 1, NULL, NULL, '', 1, 0, 0),
(5, '0', '劉建國', '0937215498', NULL, 'jianguo1122@test.com', 'Guo1122', '1965-11-22', '新北市三重區重新路五段80號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(6, '0', '黃婷婷', '0968357426', NULL, 'tingting0328@test.com', 'Ting0328', '1999-03-28', '桃園市平鎮區民族路二段19巷12號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(7, '0', '林俊傑', '0912546378', NULL, 'jj0505@test.com', 'Jj0505', '1988-05-05', '台南市安平區健康路三段9號', '2024-11-22 11:24:32', '2024-11-29 09:22:12', 1, NULL, NULL, '', 1, 0, 0),
(8, '0', '許文華', '0937654821', NULL, 'wenhua1010@test.com', 'Wen1010', '1975-10-10', '新竹市東區光復路二段188號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(9, '0', '郭曉峰', '0972345687', NULL, 'xiaofeng0920@test.com', 'Feng0920', '1990-09-20', '嘉義市東區民生南路67巷10號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(10, '0', '吳佳欣', '0953764820', NULL, 'jiaxin0722@test.com', 'Xin0722', '1982-07-22', '花蓮縣花蓮市中山路5號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(11, '0', '李志明', '0912789456', NULL, 'zhiming0408@test.com', 'Ming0408', '1970-04-08', '台北市信義區松仁路90號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(12, '0', '陳安妮', '0964387912', NULL, 'annie0223@test.com', 'Annie0223', '2002-02-23', '台中市北屯區文心路五段320號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(13, '0', '張冠宇', '0987546312', NULL, 'guanyu0808@test.com', 'Guan0808', '1993-08-08', '台南市東區崇德路99號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(14, '0', '黃嘉偉', '0976234859', NULL, 'jiawei1215@test.com', 'Wei1215', '1985-12-15', '桃園市龜山區文化一路128號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(15, '0', '林書豪', '0951234786', NULL, 'jeremy0507@test.com', 'Lin0507', '1996-05-07', '高雄市三民區建國路7號', '2024-11-22 11:24:32', '2024-11-29 09:22:30', 2, NULL, NULL, '', 1, 0, 0),
(16, '0', '王雅琪', '0912765439', NULL, 'yaqi0310@test.com', 'Yaqi0310', '1998-03-10', '台北市內湖區康寧路三段45巷10號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(17, '0', '陳浩宇', '0987213546', NULL, 'haoyu0728@test.com', 'Hao0728', '1980-07-28', '新北市板橋區文化路二段68號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(18, '0', '李美華', '0938465129', NULL, 'meihua1201@test.com', 'Mei1201', '1975-12-01', '台中市南屯區黎明路一段333號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(19, '0', '張信哲', '0976354820', NULL, 'xinzhe0415@test.com', 'Xin0415', '1990-04-15', '台南市永康區中正北路25號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(20, '0', '劉心怡', '0965743821', NULL, 'xinyi0303@test.com', 'Xin0303', '2001-03-03', '桃園市大溪區慈湖路200號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(21, '0', '許志文', '0954876239', NULL, 'zhiwen1020@test.com', 'Wen1020', '1969-10-20', '新竹縣竹北市縣政二路50巷20號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(22, '0', '郭文婷', '0987415263', NULL, 'wenting0709@test.com', 'Wen0709', '1988-07-09', '嘉義縣民雄鄉文化路8號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(23, '0', '吳佩君', '0928451736', NULL, 'peijun0520@test.com', 'Pei0520', '1995-05-20', '宜蘭縣羅東鎮中山路100號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(24, '0', '黃建華', '0913487562', NULL, 'jianhua1015@test.com', 'Hua1015', '1972-10-15', '高雄市鳳山區三民路8號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(25, '0', '林雨柔', '0937825461', NULL, 'yurou0801@test.com', 'Yu0801', '2000-08-01', '台北市士林區天母東路60巷15號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(26, '0', '王浩翔', '0951324786', NULL, 'haoxiang0612@test.com', 'Xiang0612', '1985-06-12', '新北市汐止區大同路一段200號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(27, '0', '陳嘉豪', '0978435621', NULL, 'jiahao0208@test.com', 'Hao0208', '1992-02-08', '台中市西區台灣大道二段70巷30號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(28, '0', '張子涵', '0912463578', NULL, 'zihang0915@test.com', 'Han0915', '1997-09-15', '高雄市鼓山區博愛一路18號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(29, '0', '李沛瑜', '0938745629', NULL, 'peiyu0525@test.com', 'Yu0525', '1980-05-25', '桃園市八德區福國路66號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(30, '0', '劉冠廷', '0987214653', NULL, 'guanting0812@test.com', 'Guan0812', '1991-08-12', '新竹市香山區南大路128巷6號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(31, '0', '許佳玲', '0973645821', NULL, 'jialing0105@test.com', 'Ling0105', '1983-01-05', '台南市安南區海佃路三段9號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(32, '0', '劉雲', '0954762381', NULL, 'shuwei0620@test.com', 'Wei0620', '1978-06-20', '花蓮縣吉安鄉建國路7巷2號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(33, '0', '黃志偉', '0917835462', NULL, 'zhiwei0910@test.com', 'Wei0910', '1976-09-10', '嘉義市西區文化路88號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(34, '0', '林怡君', '0934825761', NULL, 'yijun0325@test.com', 'Yi0325', '2003-03-25', '台北市松山區南京東路五段77號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(35, '0', '吳柏宇', '0975623148', NULL, 'baiyu0417@test.com', 'Bai0417', '1994-04-17', '台南市中西區海安路一段50號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(36, '0', '陳俊安', '0964823756', NULL, 'junan1212@test.com', 'An1212', '1989-12-12', '台中市東區建國路一段30號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(37, '0', '李若涵', '0912786543', NULL, 'ruohan0515@test.com', 'Ruo0515', '2002-05-15', '桃園市蘆竹區南崁路10號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(38, '0', '張柏翰', '0984327561', NULL, 'bohan0909@test.com', 'Han0909', '1971-09-09', '新北市土城區中央路四段90巷5號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 0, 0, 0),
(39, '0', '劉慧敏', '0918456372', NULL, 'huimin0925@test.com', 'Hui0925', '1992-09-25', '新北市樹林區樹德路77巷8號', '2024-11-22 11:24:32', '', 0, NULL, NULL, '', 1, 0, 0),
(40, '0', '王小明', '0912322658', NULL, 'ming0908@test.com', 'Ming0908', '2000-09-08', '桃園市中壢區新生路一段421號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(41, '0', '黃子萱', '0928471635', NULL, 'zixuan0315@test.com', 'Xuan0315', '1987-03-15', '嘉義縣朴子市中正北路68號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 1, 0, 0),
(42, '0', '林建宏', '0912563749', NULL, 'jianhong1018@test.com', 'Hong1018', '1980-10-18', '台中市北區健行路2巷22號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(43, '0', '陳昱安', '0972345867', NULL, 'yuan0512@test.com', 'Yu0512', '1995-05-12', '台北市大同區民生西路40號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(44, '0', '吳雅雯', '0957834621', NULL, 'yawen0820@test.com', 'Ya0820', '1982-08-20', '花蓮市國聯五路9號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 1, 0, 0),
(45, '0', '郭嘉文', '0987215643', NULL, 'jiawen0610@test.com', 'Wen0610', '1973-06-10', '新竹縣湖口鄉中山路123號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(46, '0', '黃家豪', '0912836457', NULL, 'jiahao1212@test.com', 'Jia1212', '2000-12-12', '新北市新莊區思源路88巷20號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(47, '0', '張佩珊', '0964827351', NULL, 'peishan0723@test.com', 'Pei0723', '1986-07-23', '台南市中區忠義路一段15號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(48, '0', '王宇軒', '0951726483', NULL, 'yuxuan0415@test.com', 'Yu0415', '1998-04-15', '桃園市觀音區仁愛路12號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 0, 0, 0),
(49, '0', '李志華', '0976345821', NULL, 'zhihua1010@test.com', 'Hua1010', '1977-10-10', '高雄市橋頭區成功路25巷3號', '2024-11-22 11:33:17', '', 0, NULL, NULL, '', 1, 1, 0),
(50, '0', '陳曉君', '0934827954', NULL, 'xiaojun0718@test.com', 'Xiao0718', '1984-07-18', '新竹縣竹東鎮竹榮路33號', '2024-11-22 11:34:46', '', 0, NULL, NULL, '', 0, 1, 0),
(51, '0', 'Chu', '', NULL, 'chu@example.com', '0278a02a9e6ac9adaa3ddbd426208958', '2001-02-06', NULL, '2024-11-29 13:29:29', '', 0, NULL, NULL, '', 0, 0, 1),
(52, '0', '姚馨雯', '', NULL, 'news@test.com', '81dc9bdb52d04dc20036dbd8313ed055', '2000-11-01', NULL, '2024-11-29 15:05:02', '', 0, NULL, NULL, '', 0, 0, 0),
(53, '0', '妙蛙種子', '', NULL, 'frog@test.com', '938c2cc0dcc05f2b68c4287040cfcf71', '2024-12-11', NULL, '2024-12-03 11:22:43', '', 0, NULL, NULL, '', 0, 0, 0),
(54, '0', 'fff', '0988888222', 1, 'fff@test.com', '$2b$10$Rx8rYWye1I9nQHJBuhIHVeAU3CkUe1l7WGpg0.jmLj0RyyDhfz5h6', '2000-01-02', 'aaa', '2025-02-26 20:46:20.325000', '2025-02-26 21:49:45', 0, '222', '911222333', '', 0, 0, 0),
(55, '0', '未命名用戶', '', NULL, 'email@example.com', '$2b$10$qhf3s3X9wJfu/b3kz3s0BOajO0irjNJIBxOAlaj855VNLb14noO1u', '0000-00-00', NULL, '2025-02-26 23:06:40.511000', '', 0, NULL, NULL, '', 0, 0, 0),
(56, '0', 'ffff呀', '0900000011', 3, 'ffff@test.com', '$2b$10$trHUeEYuVNxxYVVAlufujuCn/D6KNDq8miuWfPfeNzBZiVQ1ifKi6', '1999-02-01', '嗷嗷嗷', '2025-02-26 23:09:26.511000', '2025-03-16 03:22:15', 0, '111', '0922111222', '/img/member/146d73ea-0e0a-4a74-86e8-9d7ae5d4db33.jpg', 0, 0, 0),
(57, '0', '未命名用戶', '', NULL, 'test@example.com', '$2b$10$5t1aaLxOR9yIRGqBrDliju7TPA9/rDwJGUO2X506XZ8slzrUCtB.q', '0000-00-00', NULL, '2025-02-26 23:12:30.815000', '', 0, NULL, NULL, '', 0, 0, 0),
(58, '0', '', '', NULL, 'test@test.com', '$2b$10$p4eux3zgmtZt3f8vwjV6AObVx7Dc6CuaUeYy4k.ekSrvz09Is3NIy', '0000-00-00', NULL, '2025-02-26 23:25:43.060000', '', 0, NULL, NULL, '/img/default.png', 0, 0, 0),
(59, '0', '', '', NULL, 'test1@test.com', '$2b$10$E8yOiIaetejnSrbzuwBFmOT/wEewMSaJJLAQkYBPvnYIB.w9d/pyS', '0000-00-00', NULL, '2025-02-26 23:36:58.373000', '', 0, NULL, NULL, '/img/default.png', 0, 0, 0),
(60, 'Gdsggd7qjxf607mppUdJ6N2mb0s2', 'CCC', '0900000011', 2, 'cathytest111@gmail.com', '$2b$10$3oDfA4G289pVOWgoQ7rVROksOBKy9LKL5EHehz4eLHhHZ/xdTW/QC', '0000-00-00', 'aaa', '2025-03-12 19:22:28', '2025-03-16 11:52:49', 0, NULL, NULL, '/img/member/b1894c20-7384-4cce-a141-32a7b23a7af5.JPEG', 0, 0, 0),
(61, '', 'Catherine', '0988111222', 1, 'lulu712820@gmail.com', '$2b$10$kj3ZyvMBIV430dI0rVmrwOKrbJSsaZboDyfcAoUS091K3ZYct83BS', '2001-07-12', '111', '2025-03-16 09:56:14.071000', '2025-03-16 11:27:44', 0, NULL, NULL, '/img/member/261a2312-4e6f-4d07-86c4-a5d09d624c01.jpg', 0, 0, 0),
(63, '', '', '', NULL, 'chu@test.com', '$2b$10$JHxSg2XruaSbuqpt9FYX1Oa9zKcge/HTcEqY4ZChNDocJTqDQvrD.', '0000-00-00', NULL, '2025-03-17 16:09:01.212000', '', 0, NULL, NULL, '/img/default.png', 0, 0, 0),
(64, 'tjdV2gKi9NSwI8Y8LLOqijLFai32', 'divein', '', NULL, 'diveintest1@gmail.com', '', '0000-00-00', NULL, '2025-03-17 16:42:10', '', 0, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIz7ygyTG7GEySfKkhpzn50srzkrksQjrNFFMngwNH6MR30KQ=s96-c', 0, 0, 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `varient_id` (`product_id`);

--
-- 資料表索引 `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `varient_id` (`product_id`);

--
-- 資料表索引 `order_shipping_info`
--
ALTER TABLE `order_shipping_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- 資料表索引 `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`series`);

--
-- 資料表索引 `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- 資料表索引 `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_idx` (`product_id`);

--
-- 資料表索引 `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- 資料表索引 `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `color`
--
ALTER TABLE `color`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_shipping_info`
--
ALTER TABLE `order_shipping_info`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_details`
--
ALTER TABLE `product_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '圖片編號', AUTO_INCREMENT=42;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `size`
--
ALTER TABLE `size`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
