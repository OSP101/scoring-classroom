-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 02, 2024 at 05:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scoring_classroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `caretaker`
--

CREATE TABLE `caretaker` (
  `id` int(11) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `idcourse` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `caretaker`
--

INSERT INTO `caretaker` (`id`, `stdid`, `idcourse`) VALUES
(1, '633020334-8', 'SC363001'),
(2, '633020334-8', 'CP341005'),
(3, '633020334-8', 'SC362102'),
(4, '123456789-0', 'SC363001'),
(5, '643020023-6', 'SC363001'),
(6, '643020023-6', 'CP341005'),
(7, '643020349-6', 'SC363001'),
(8, '643020349-6', 'CP341005'),
(9, '643020356-9', 'SC363001'),
(10, '643020356-9', 'CP341005'),
(11, '643020399-1', 'SC363001'),
(12, '643020399-1', 'CP341005'),
(13, '643020415-9', 'SC363001'),
(14, '643020415-9', 'CP341005'),
(15, '643021099-8', 'SC363001'),
(16, '643021099-8', 'CP341005'),
(17, '643021116-4', 'SC363001'),
(18, '643021116-4', 'CP341005'),
(19, '', ''),
(20, '123456789-0', 'CP341005');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `idcourse` varchar(8) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`idcourse`, `name`, `image`, `description`) VALUES
('CP341005', 'Software design and analysis', '4eve-1.jpg', 'การวิเคราะห์และออกแบบซอฟต์แวร์'),
('SC362102', 'Software engineering', '4evebody1.jpg', ' วิศวกรรมซอฟต์แวร์'),
('SC363001', 'Systems analysis and design', '4evebody2.jpg', 'การวิเคราะห์และออกแบบระบบ');

-- --------------------------------------------------------

--
-- Table structure for table `edit_point`
--

CREATE TABLE `edit_point` (
  `id` int(11) NOT NULL,
  `idtitelwork` int(11) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `teachid` varchar(100) NOT NULL,
  `point` int(11) NOT NULL,
  `des` text NOT NULL,
  `status` int(11) NOT NULL,
  `idcourse` varchar(8) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description_t` text DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT '1998-12-31 17:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `edit_point`
--

INSERT INTO `edit_point` (`id`, `idtitelwork`, `stdid`, `teachid`, `point`, `des`, `status`, `idcourse`, `create_at`, `description_t`, `update_at`) VALUES
(1, 1, '643020402-8', 'Supphitan Paksawad', 10, 'ลงคะแนนให้ผิด', 3, 'SC363001', '2024-06-30 01:01:16', 'vm', '2024-07-01 22:21:44'),
(3, 1, '653380003-6', 'Supphitan Paksawad', 5, 'ทดสอบให้ 5 คะแนนละกันนะ', 2, 'SC363001', '2024-07-01 18:14:48', NULL, '2024-07-01 22:08:45'),
(4, 1, '653380002-8', 'Supphitan Paksawad', 5, 'Test edit point', 2, 'SC363001', '2024-07-01 22:09:48', NULL, '2024-07-01 22:09:57'),
(5, 1, '653380002-8', 'Supphitan Paksawad', 5, 'test อีกครั้ง', 2, 'SC363001', '2024-07-01 22:10:59', NULL, '2024-07-01 22:11:06');

-- --------------------------------------------------------

--
-- Table structure for table `enllo`
--

CREATE TABLE `enllo` (
  `id` int(11) NOT NULL,
  `idcourse` varchar(8) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `type` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enllo`
--

INSERT INTO `enllo` (`id`, `idcourse`, `stdid`, `type`) VALUES
(3, 'SC363001', '643020402-8', NULL),
(4, 'SC363001', '653380002-8', NULL),
(5, 'SC363001', '653380003-6', NULL),
(6, 'SC363001', '653380004-4', NULL),
(7, 'SC363001', '653380005-2', NULL),
(8, 'SC363001', '653380006-0', NULL),
(9, 'SC363001', '653380008-6', NULL),
(10, 'SC363001', '653380009-4', NULL),
(11, 'SC363001', '653380010-9', NULL),
(12, 'SC363001', '653380011-7', NULL),
(13, 'SC363001', '653380012-5', NULL),
(14, 'SC363001', '653380013-3', NULL),
(15, 'SC363001', '653380085-8', NULL),
(16, 'SC363001', '653380086-6', NULL),
(17, 'SC363001', '653380087-4', NULL),
(18, 'SC363001', '653380088-2', NULL),
(19, 'SC363001', '653380089-0', NULL),
(20, 'SC363001', '653380090-5', NULL),
(21, 'SC363001', '653380091-3', NULL),
(22, 'SC363001', '653380092-1', NULL),
(23, 'SC363001', '653380093-9', NULL),
(24, 'SC363001', '653380094-7', NULL),
(25, 'SC363001', '653380095-5', NULL),
(26, 'SC363001', '653380096-3', NULL),
(27, 'SC363001', '653380099-7', NULL),
(28, 'SC363001', '653380100-8', NULL),
(29, 'SC363001', '653380101-6', NULL),
(30, 'SC363001', '653380102-4', NULL),
(31, 'SC363001', '653380104-0', NULL),
(32, 'SC363001', '653380105-8', NULL),
(33, 'SC363001', '653380106-6', NULL),
(34, 'SC363001', '653380107-4', NULL),
(35, 'SC363001', '653380108-2', NULL),
(36, 'SC363001', '653380109-0', NULL),
(37, 'SC363001', '653380110-5', NULL),
(38, 'SC363001', '653380111-3', NULL),
(39, 'SC363001', '653380112-1', NULL),
(40, 'SC363001', '653380113-9', NULL),
(41, 'SC363001', '653380115-5', NULL),
(42, 'SC363001', '653380116-3', NULL),
(43, 'SC363001', '653380118-9', NULL),
(44, 'SC363001', '653380119-7', NULL),
(45, 'SC363001', '653380245-2', NULL),
(46, 'SC363001', '653380246-0', NULL),
(47, 'SC363001', '653380248-6', NULL),
(48, 'SC363001', '653380249-4', NULL),
(49, 'SC363001', '653380250-9', NULL),
(50, 'SC363001', '653380251-7', NULL),
(51, 'SC363001', '653380252-5', NULL),
(52, 'SC363001', '653380253-3', NULL),
(53, 'SC363001', '653380254-1', NULL),
(54, 'SC363001', '653380256-7', NULL),
(55, 'SC363001', '653380257-5', NULL),
(56, 'SC363001', '653380260-6', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `extra_point`
--

CREATE TABLE `extra_point` (
  `id` int(11) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `idcourse` varchar(8) NOT NULL,
  `teachid` varchar(100) NOT NULL,
  `point` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `extra_point`
--

INSERT INTO `extra_point` (`id`, `stdid`, `idcourse`, `teachid`, `point`, `create_at`) VALUES
(1, '123456789-0', 'SC363001', '633020334-8', 1, '2024-06-24 21:50:28'),
(2, '653380002-8', 'SC363001', '633020334-8', 1, '2024-06-24 21:54:32'),
(3, '653380003-6', 'SC363001', '633020334-8', 1, '2024-06-24 21:55:48'),
(5, '653380005-2', 'SC363001', '633020334-8', 1, '2024-06-24 22:06:17'),
(6, '653380002-8', 'SC363001', '633020334-8', 1, '2024-06-25 01:22:19'),
(7, '643020402-8', 'SC363001', 'Supphitan Paksawad', 1, '2024-06-30 00:23:09'),
(8, '653380002-8', 'SC363001', 'Supphitan Paksawad', 1, '2024-06-30 00:23:47'),
(9, '643020402-8', 'SC363001', 'Supphitan Paksawad', 1, '2024-06-30 00:23:53'),
(10, '643020402-8', 'SC363001', 'Supphitan Paksawad', 1, '2024-06-30 01:12:43'),
(11, '643020402-8', 'SC363001', 'Supphitan Paksawad', 1, '2024-06-30 01:21:36');

-- --------------------------------------------------------

--
-- Table structure for table `opencourse`
--

CREATE TABLE `opencourse` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `idcourse` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opencourse`
--

INSERT INTO `opencourse` (`id`, `name`, `idcourse`) VALUES
(3, 'ปกติ', 'SC363001'),
(4, 'โครงการพิเศษ', 'SC363001'),
(5, 'ปกติ', 'CP341005'),
(6, 'ปกติ', 'SC362102'),
(7, 'โครงการพิเศษ', 'SC362102');

-- --------------------------------------------------------

--
-- Table structure for table `points`
--

CREATE TABLE `points` (
  `id` int(11) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `teachid` varchar(100) NOT NULL,
  `idtitelwork` int(11) NOT NULL,
  `point` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT '1998-12-31 17:00:00' ON UPDATE current_timestamp(),
  `delete_at` timestamp NOT NULL DEFAULT '1998-12-31 17:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `points`
--

INSERT INTO `points` (`id`, `stdid`, `teachid`, `idtitelwork`, `point`, `create_at`, `update_at`, `delete_at`) VALUES
(11, '643020402-8', 'Supphitan Paksawad', 1, 10, '2024-06-30 19:24:35', '1998-12-31 17:00:00', '1998-12-31 17:00:00'),
(12, '653380004-4', 'Supphitan Paksawad', 10, 1, '2024-06-30 19:58:21', '1998-12-31 17:00:00', '1998-12-31 17:00:00'),
(13, '653380005-2', 'Supphitan Paksawad', 12, 9, '2024-06-30 23:14:08', '1998-12-31 17:00:00', '1998-12-31 17:00:00'),
(14, '653380006-0', 'Supphitan Paksawad', 1, 11, '2024-07-01 00:24:33', '1998-12-31 17:00:00', '1998-12-31 17:00:00'),
(15, '653380003-6', 'Supphitan Paksawad', 1, 10, '2024-07-01 18:14:23', '1998-12-31 17:00:00', '1998-12-31 17:00:00'),
(16, '653380002-8', 'Supphitan Paksawad', 1, 5, '2024-07-01 22:09:25', '2024-07-01 22:11:07', '1998-12-31 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `titelwork`
--

CREATE TABLE `titelwork` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` varchar(10) NOT NULL,
  `typework` int(11) NOT NULL,
  `maxpoint` int(11) NOT NULL,
  `idcourse` varchar(8) NOT NULL,
  `delete_at` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `titelwork`
--

INSERT INTO `titelwork` (`id`, `name`, `date`, `typework`, `maxpoint`, `idcourse`, `delete_at`) VALUES
(1, 'Lab 1', '2024-06-18', 1, 10, 'SC363001', NULL),
(2, 'Lab 2', '2024-06-18', 1, 10, 'CP341005', NULL),
(3, 'Lab 3', '2024-06-19', 1, 10, 'CP341005', NULL),
(4, 'Lab 4', '2024-06-19', 1, 10, 'CP341005', 'deleted'),
(5, 'Ass 2', '2024-06-19', 2, 10, 'CP341005', 'deleted'),
(7, 'Lab 6', '2024-06-25', 1, 15, 'CP341005', 'dele'),
(8, 'Ass 4', '2024-06-20', 2, 10, 'CP341005', NULL),
(9, 'ทดสอบ', '2024-06-20', 2, 10, 'CP341005', 'deleted'),
(10, 'Lab 2', '2024-06-30', 1, 10, 'SC363001', NULL),
(11, 'Lab 3', '2024-07-01', 1, 10, 'SC363001', NULL),
(12, 'Lab 4', '2024-07-01', 1, 10, 'SC363001', 'deleted'),
(13, 'Lab 5', '2024-07-01', 1, 10, 'SC363001', 'deleted');

-- --------------------------------------------------------

--
-- Table structure for table `topic_create`
--

CREATE TABLE `topic_create` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `des` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topic_create`
--

INSERT INTO `topic_create` (`id`, `name`, `des`, `status`) VALUES
(1, 'งานเดี่ยว', 'งานเดี่ยวในแต่ละสัปดาห์', 1),
(2, 'งานกลุ่ม', 'งานกลุ่มนำเสนอหน้าห้อง', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `stdid` varchar(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `section` int(11) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `track` varchar(20) DEFAULT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`stdid`, `name`, `email`, `section`, `image`, `track`, `type`) VALUES
('123456789-0', 'Jakkrit Kaewyotha', 'jakkritk@kku.ac.th', 1, 'https://api.computing.kku.ac.th//storage/images/2024-6-3-1718094395-1.jpeg', 'BIT', 2),
('633020334-0', 'Sutthida Doungkunla', 'supphitan.pk@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLzvAyDoRxNYG6zuTtlXQTZHCSHT1P1SQXon_s00YrTl6T0KCK7uA', 'Network', 2),
('633020334-8', 'Supphitan Paksawad', 'supphitan.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLzvAyDoRxNYG6zuTtlXQTZHCSHT1P1SQXon_s00YrTl6T0KCK7uA', 'Network', 2),
('643020023-6', 'นางสาวอัญธิมา ผาละบุตร', 'auntima.p@kkumail.com', 1, 'https://lh5.googleusercontent.com/a-/ALV-UjWhmGIN2Q4Dw4BmTJi-kT8PTKxjmRN3fTfzGWoMipi3EL1YoK0', 'Web and Mobile', 2),
('643020349-6', 'นางสาวกมลวรรณ หอมสมบัติ', 'kamonwan.h@kkumail.com', 1, 'https://lh4.googleusercontent.com/a-/ALV-UjV7j-vbAU5IpgaJRFVe0fCTyxBp0xoDtlhA-psg-GKwbsbRq7A', 'Web and Mobile', 2),
('643020356-9', 'นางสาวคนึงนิจ แสนโยธะกะ', 'kanuengnid.s@kkumail.com', 1, 'https://lh6.googleusercontent.com/a-/ALV-UjUtw62Avp6TldSyLGF5937Sp_S_eukBsfgpILwldlpNicKg33YW', 'Web and Mobile', 2),
('643020399-1', 'นางสาวพิมพ์นภา ศรีบุญเรือง', 'pimnapa.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjUD-SjDNeqpOrz8eMhpCpnNUE627tHbNTghIJalXvTA19TLqpY', 'Web and Mobile', 2),
('643020402-8', 'นายภพ ในจิตต์', 'phop.n@kkumail.com', 1, 'https://i.pravatar.cc/150?u=a042581f4e29026024d', 'Web and Mobile', 1),
('643020415-9', 'นางสาวศิรประภา ปัตตะ', 'siraprapa.pat@kkumail.com', 1, 'https://lh6.googleusercontent.com/a-/ALV-UjVh7r3cs2-NPqH_GOgAxVwM5F08IfxudlV6hCrEJ5EnrO_w2YM', 'Web and Mobile', 2),
('643021099-8', 'นางสาวกัลยาณี บุญรินทร์', 'kanlayanee.bo@kkumail.com', 1, 'https://lh5.googleusercontent.com/a-/ALV-UjXFzuODE1DMXXgdXjgpVI3LLguElGKwI9V-HtXMs5bGkETLgBk', 'Web and Mobile', 2),
('643021116-4', 'นายภานุพัฒน์ พลเยี่ยม', 'panupat.ph@kkumail.com', 1, 'https://lh5.googleusercontent.com/a-/ALV-UjUgUNyoyDIut0Bku8godl_AZfRGjCMhTcPZtt6lJZFTuGDJvZvj', 'Web and Mobile', 2),
('653380002-8', 'นายกมลจิตต์ พูนพิพัฒนพงษ์', 'kamonjit.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJ_AJfid_tVTRDvhpqp7RWJBTb7FFEAJZD6ceKJDxSMZDZmpQ=s96-p-k-rw-no-mo', 'Network', 1),
('653380003-6', 'นายเจษฎา เพ็งหนู', 'jetsada.phe@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJn6mTwy_s9VWbt5XLFDmdt5Q-bgn8QKrEMjvKU7mUJqjcgqw', 'Network', 1),
('653380004-4', 'นางสาวชญาดา ภูสีดิน', 'chayada.phoo@kkumail.com', 1, 'https://lh4.googleusercontent.com/a-/ALV-UjXXW6nnXfQ-f0C8KAirX6J7nIdmaZOOpW5Ifm232VsmycLP9w', 'Network', 1),
('653380005-2', 'นางสาวณัฐริกา โสมิตร', 'natthariga.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocKyKa3bLqeKzC9FaZVbEzlIj7HcdgqAlGjmIZfwpRtY4CrZ2w', 'Web and Mobile', 1),
('653380006-0', 'นายธรรมรัตน์ วงษ์มา', 'thammarat.w@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocK76KSaLzru5SuH_XKgL_EqdIUqJ6wtmvSVFuSHdtgTZF4Wlg', 'Network', 1),
('653380008-6', 'นายพีระพงศ์ เต้าประจิม', 'peeraphong.t@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjX3MHJOnuG5Z2PtDXCMtH5ZVPBbWWpTg6VN6dkyEVwW_07VZkdR', 'Network', 1),
('653380009-4', 'นายมานพ เวียนเทียน', 'manop.v@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLWTgWGn2FD50oJDTs70DqGRexCBihjv-aXSs_eyvZrVyQx', 'Web and Mobile', 1),
('653380010-9', 'นายรพีพัฒน์ ศรีสวัสดิ์', 'rapeepat.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJjGpgfHf1uRTJOkN4l_PzLXwsHYBsVx2wrzQZSPf9UKwMrtA', 'Network', 1),
('653380011-7', 'นางสาววรรณภา บุษบง', 'wannapa.bu@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVmz8kilOeAiXXxZHybDrzpN46o01WCkFknj5Tt8y9W1FGk-BU', 'Web and Mobile', 1),
('653380012-5', 'นายวรวุธ โคตรนาแพง', 'worawut.kh@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVPY55jeSYFOxv8KziDA23JoKUDU0sTzfFoHG8KuRrMJoq8pg8', 'Network', 1),
('653380013-3', 'นางสาวอินทิรา ฤทธิพรม', 'inthira.r@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjW6xvJvooQoHlgIpdXibEfbI7fcZAdsJyhbAGGGo8wTQW9sd6U', 'Web and Mobile', 1),
('653380085-8', 'นางสาวขวัญเนตร สุวรรณศรี', 'khwannet.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjXQQ6ns6TmlwO6ZQgyxButOmM9GYVoqopLYBarWxMS7NT2nzC0', 'Web and Mobile', 1),
('653380086-6', 'นายเจษฎา สมพร', 'jetsada.som@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJMwJc9znpIXpEutPDayXkXiFb882rSk84lKXgQU0sb5domDq4', 'BIT', 1),
('653380087-4', 'นายชนวีร์ คงพรม', 'chanawee.k@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWqUljYEAbWVJH2_0PHoIutHJ1ZJPce-oFtI2EkeMX43ZK92g', 'BIT', 1),
('653380088-2', 'นายชนินทร์ บุตรรอด', 'chanin.bu@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjUB3t--M3QamiC2y9Y3cS8CG_1PFBzNwPM9HjVwjqiJGIxWOA', 'Network', 1),
('653380089-0', 'นางสาวณัฐชา แสงไชยา', 'nattacha.sa@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWemZqmR0dPw-_cP1ZHzcfJ9qUWytASa6sdgWQ5h4vVAkgpa6U', 'BIT', 1),
('653380090-5', 'นางสาวณัฐทิยา แสนนา', 'nattiya.sa@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocIuHFxoTnTLxD9sga7qovASupifD8B0qKhFV6bZlfbSLf2GIQ', 'Web and Mobile', 1),
('653380091-3', 'นายณัฐพล ลักษณะ', 'nattapon.la@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJuVkruvo-ehDe9_jM0_ZYEYLFdGbxB2-PYcuXBlQCvf91vYg', 'BIT', 1),
('653380092-1', 'นายณัฐวิชร์ แก้วเบ้า', 'natthawit.k@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVDvnSgZA79BAyyK7P7Mtp5HRqvHrxIEEaF_0LEwIC4I_v2nKs', 'Network', 1),
('653380093-9', 'นางสาวตรีรัตน์ ตรีพงษ์', 'treerat.t@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjUvNckF1HTFHvhJR02c5pHnMrVohxW9_2ccgoB7yv3VKRptrS0', 'Web and Mobile', 1),
('653380094-7', 'นายธนกฤต แก้วสุวรรณ', 'thanakrit.kaew@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWtTX5UiixFc1gzCAI4Mx2bAlCym5KbQUt6N8Ku1L8mRxlMew', 'BIT', 1),
('653380095-5', 'นายธฤต สุทธิธรรม', 'tharit.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVD62Bl9t8SHV4HcU6t7V2Du2mYJBahQ6exvQ-nrROsJ788zLI', 'Network', 1),
('653380096-3', 'นางสาวธัญชนก พละกรณ์', 'thunchanok.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWlVLpamQPhulQJ9f3VShh-v_n_y8H-YgpaY8DJB7GKDuPUbLo', 'BIT', 1),
('653380099-7', 'นางสาวเบญจพร พันธโคตร', 'benjaporn.pan@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVJYDpSFwgRAhnRf6bfzUgPyBRRh_PYWZPxZ1tsG2D8FvfY7ur4', 'Network', 1),
('653380100-8', 'นายปณิธิ เสือสุภาพ', 'panithi.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWVWMOZ9KdfWDJlZJNq-4kTYxQaXQAkUYCzRBoywJaycQi5ZeE', 'BIT', 1),
('653380101-6', 'นางสาวปิยะณัฐ รูปสูง', 'piyanat.r@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocIokWyT20l-gWq71NfkhtUqfzAtxSymeBLKzTzzYRs9-ybB_A', 'Web and Mobile', 1),
('653380102-4', 'นางสาวพรทิพย์ ชมจันทร์', 'phornthip.c@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLHpXu6MYsxUQyB0CiqfLH7hsCzyco-mTueHEb43UksdtlK8w', 'BIT', 1),
('653380104-0', 'นายพัชรพงษ์ พูนทรัพย์อมร', 'patcharapong.ph@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVmkGqvyQI2_jP9_k0LT0wqVggF5YyE0Wm6wjOgRyfUnjsixSg', 'Web and Mobile', 1),
('653380105-8', 'นายพิสิษฐ์ จินานิกร', 'pisit.j@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWgcIk4ozQSRb8lsNlxtsxyoV6bIdMp5k4ca2gZS_ntUYqmodU', 'Network', 1),
('653380106-6', 'นายพีรพล จริยานุกูลวงศ์', 'pheeraphon.j@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocIAspf5D50MDEi_WeINOJTQ_VHRNZ3r325LMC-ZpsFJTtlOhg', 'Network', 1),
('653380107-4', 'นายพีรพล เล่าสุอังกูร', 'peeraphol.l@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLLOXdWR67PpF3UDbCXL-snkpeZ3lvwZhSGon-67Vhb1z76sg', 'Web and Mobile', 1),
('653380108-2', 'นางสาวพุธิตา งาพาณิชย์วัฒน์', 'phutthita.n@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWCKA2907sb_zOCepJjh1HbUQdBj3Ds4ctzDYA1GFV-qj6HaR8', 'BIT', 1),
('653380109-0', 'นายภูมิรพี เกษรไพบูลย์', 'phumrapee.k@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocKoRVMo9hFoVuWVCH_GGMQeVPreQyXJNc0EmUROT6mJZAxJgg', 'Web and Mobile', 1),
('653380110-5', 'นายวชิรวิทย์ แท่งทองหลาง', 'wachirawit.ta@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWT0MOoLYsj7fNfZSu-NQnUE5G6fHxZY9TEOjqgn10ML7XxJ30', 'Web and Mobile', 1),
('653380111-3', 'นางสาวศศิปรียา สีราช', 'sasipreya.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjU_i-y5h-nyrkW6MrN4GRGFQ9MCupLRDygDyFkNoo_87baM30g', 'BIT', 1),
('653380112-1', 'นางสาวศศิวิมล ผ่องใส', 'sasiwimon.ph@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjXviRNVOwWdxfIr38j4Lht27vT0Dzq-3E1JMPIODL3pXJmW7bU', 'BIT', 1),
('653380113-9', 'นายสัญญพงศ์ พิพัฒน์โภคิน', 'sanyaphong.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVYnhLQBChCLhdvD0PY0HcGv75KGtSc9pL29Z4TvgeWZkVe0FM', 'Network', 1),
('653380115-5', 'นางสาวสุจิตรา สีลาพัฒน์', 'sujittra.se@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjXxt0ewJmxqV_i-eqAyoFW7IqWhI8OsKlIqcfWiA9YOMbnrb1U', 'BIT', 1),
('653380116-3', 'นางสาวสุภัสรา บุญตาท้าว', 'supatsara.b@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVQCEezWDiXwxMmEcAHv1Xf7WbCk4X9JP8iHvI1Wi8PdMrbZBU', 'BIT', 1),
('653380118-9', 'นายอภิชัย ทินจอง', 'apichai.ti@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocKvGgLp6euoeR43SwDVy-H5xjZy09XSOygil_jUpW9HiGJe7g', 'Web and Mobile', 1),
('653380119-7', 'นายอุทิศ สวัสดี', 'uthit.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjXoodIMgPJq99jwYvNAHHbwCX26foDzEP0EfYtw-UFPPrWEuzPC', 'BIT', 1),
('653380245-2', 'นายฐากูร เอ็นสาร', 'thakun.e@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVc3kBOvqfb7kxjSiwmECLC9Av6hmUOMNDoI8_Ai91co_7SpWI', 'Network', 1),
('653380246-0', 'นางสาวฐิตาภา ไขชัยภูมิ', 'titapa.k@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjUj66ucQg501JyfFWJHwgJn6pu4m1iOjU25IBDZ8sDmg10UKaQ', 'BIT', 1),
('653380248-6', 'นายนนทวัฒน์ วิรุณปักษี', 'nonthawat.wi@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjXnGdOl_1n46B8stYIE8aTVJu8H6Hi2MMcukTAebgeWt5D7VqyO', 'BIT', 1),
('653380249-4', 'นายนภัทร ธันยภรสกล', 'naphat.th@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjUXxZ76uH8H4Dw14stSyqaYi5Gdq8iccdpkX67W-myuIn-iBfs', 'BIT', 1),
('653380250-9', 'นายนวมินทร์ คำจันทร์', 'nawamin.c@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocKcCZ82lbUEukV9Ya7c0MEcFGCTLV37KupF3vtbuqAB5aTVxw', 'BIT', 1),
('653380251-7', 'นางสาวนิชธาวัลย์ พุกน้อย', 'nitthawan.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocKrtWZ3BtA__y_T109hiFyBg_JbMggxDDnTU5w7pCx3gDMrRg', 'Web and Mobile', 1),
('653380252-5', 'นางสาวบุษยมาส สมบูรณ์ทวง', 'bussayamas.s@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjU9IlUWO0iXhCwtBKoEy_7_CrVJLI-OE_lQa2xizWtm_dS4Ais', 'BIT', 1),
('653380253-3', 'นางสาวพัชราพร นิลพงษ์', 'phatcharaporn.ni@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLfR-5WDwb4lQfdBBNup00iBJK1ZfpGuGz-WMHUvIb71TeMHA', 'Web and Mobile', 1),
('653380254-1', 'นางสาวภรกนก ทุริดไธสง', 'pornkanok.t@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjU-3A05ITEzZJS8ISeQX-ObRzHnWwdRTG7viu5BdZOhaPZXnf0', 'BIT', 1),
('653380256-7', 'นายภีรายุ ภัทรอร่าม', 'peerayu.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocJaaWLLc39CXiiVOkpp8ObJgpEg54JKKUsDahDQe7cnePviTQ', 'BIT', 1),
('653380257-5', 'นางสาวศรัณยา โสสุด', 'saranya.sos@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWsUfCLNszsB8W-aF8gZbC2z0nteet6ThdQPcvHsL9K3U22Mlg', 'Web and Mobile', 1),
('653380260-6', 'นางสาวอัญชิสา นามกันยา', 'unchisa.n@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjWSP8f8JS4s-RNc-naQBpf3hXVrrhWbFH48f0hntOEid4SEuQ', 'Network', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `caretaker`
--
ALTER TABLE `caretaker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`idcourse`);

--
-- Indexes for table `edit_point`
--
ALTER TABLE `edit_point`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enllo`
--
ALTER TABLE `enllo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `extra_point`
--
ALTER TABLE `extra_point`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `opencourse`
--
ALTER TABLE `opencourse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `points`
--
ALTER TABLE `points`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `titelwork`
--
ALTER TABLE `titelwork`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topic_create`
--
ALTER TABLE `topic_create`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`stdid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `caretaker`
--
ALTER TABLE `caretaker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `edit_point`
--
ALTER TABLE `edit_point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `enllo`
--
ALTER TABLE `enllo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `extra_point`
--
ALTER TABLE `extra_point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `opencourse`
--
ALTER TABLE `opencourse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `points`
--
ALTER TABLE `points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `titelwork`
--
ALTER TABLE `titelwork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `topic_create`
--
ALTER TABLE `topic_create`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
