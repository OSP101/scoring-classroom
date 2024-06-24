-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2024 at 03:50 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

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
('CP341005', 'Software design and analysis', '4eve-1.jpg', 'Test create SA for 4eve'),
('SC362102', 'Software engineering', '4evebody1.jpg', 'Test create SA for 4eve'),
('SC363001', 'Systems analysis and design', '4evebody2.jpg', 'Test create SA for 4eve');

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
(12, 'SC363001', '653380011-7', NULL);

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
(9, 'ทดสอบ', '2024-06-20', 2, 10, 'CP341005', 'deleted');

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
('653380011-7', 'นางสาววรรณภา บุษบง', 'wannapa.bu@kkumail.com', 1, 'https://lh3.googleusercontent.com/a-/ALV-UjVmz8kilOeAiXXxZHybDrzpN46o01WCkFknj5Tt8y9W1FGk-BU', 'Web and Mobile', 1);

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
-- Indexes for table `enllo`
--
ALTER TABLE `enllo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `opencourse`
--
ALTER TABLE `opencourse`
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
-- AUTO_INCREMENT for table `enllo`
--
ALTER TABLE `enllo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `opencourse`
--
ALTER TABLE `opencourse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `titelwork`
--
ALTER TABLE `titelwork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `topic_create`
--
ALTER TABLE `topic_create`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
