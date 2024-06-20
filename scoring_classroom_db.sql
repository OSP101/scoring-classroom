-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 20, 2024 at 04:19 PM
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
(3, '633020334-8', 'SC362102');

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
  `idopen` int(11) NOT NULL,
  `stdid` varchar(11) NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enllo`
--

INSERT INTO `enllo` (`id`, `idopen`, `stdid`, `type`) VALUES
(1, 3, '633020334-8', 2),
(2, 3, '633020334-0', 2);

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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `stdid` varchar(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `section` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `track` varchar(10) NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`stdid`, `name`, `email`, `section`, `image`, `track`, `type`) VALUES
('633020334-0', 'Sutthida Doungkunla', 'supphitan.pk@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLzvAyDoRxNYG6zuTtlXQTZHCSHT1P1SQXon_s00YrTl6T0KCK7uA', 'Network', 1),
('633020334-8', 'Supphitan Paksawad', 'supphitan.p@kkumail.com', 1, 'https://lh3.googleusercontent.com/a/ACg8ocLzvAyDoRxNYG6zuTtlXQTZHCSHT1P1SQXon_s00YrTl6T0KCK7uA', 'Network', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enllo`
--
ALTER TABLE `enllo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
