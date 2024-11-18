-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 18, 2024 at 06:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blood`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `userId` varchar(10) NOT NULL,
  `password` varchar(8) NOT NULL,
  `adminName` varchar(100) DEFAULT NULL,
  `adminNumber` varchar(15) DEFAULT NULL,
  `adminEmail` varchar(100) DEFAULT NULL,
  `adminAddress` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`userId`, `password`, `adminName`, `adminNumber`, `adminEmail`, `adminAddress`) VALUES
('admin', 'admin', 'Pavan C H', '7483022523', 'bdms@gmail.com', 'Mysuru');

-- --------------------------------------------------------

--
-- Table structure for table `bloodrequests`
--

CREATE TABLE `bloodrequests` (
  `requestId` varchar(6) NOT NULL,
  `requestedBy` varchar(8) NOT NULL,
  `requestBloodBank` varchar(100) NOT NULL,
  `requestBlood` varchar(10) NOT NULL,
  `bloodQuantity` int(11) NOT NULL,
  `personNameToContact` varchar(100) NOT NULL,
  `personNumberToContact` varchar(15) NOT NULL,
  `urgencyLevel` varchar(100) NOT NULL,
  `selectedState` varchar(50) NOT NULL,
  `selectedDistrict` varchar(50) NOT NULL,
  `selectedTaluq` varchar(50) DEFAULT NULL,
  `selectedCity` varchar(50) NOT NULL,
  `preferredDonorDistance` int(11) NOT NULL,
  `additionalNotes` text DEFAULT NULL,
  `requestSend` timestamp NOT NULL DEFAULT current_timestamp(),
  `requestFulfilled` tinyint(4) DEFAULT 0,
  `requestFullfilledBy` varchar(8) NOT NULL,
  `requestFulfilledOn` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bloodrequests`
--

INSERT INTO `bloodrequests` (`requestId`, `requestedBy`, `requestBloodBank`, `requestBlood`, `bloodQuantity`, `personNameToContact`, `personNumberToContact`, `urgencyLevel`, `selectedState`, `selectedDistrict`, `selectedTaluq`, `selectedCity`, `preferredDonorDistance`, `additionalNotes`, `requestSend`, `requestFulfilled`, `requestFullfilledBy`, `requestFulfilledOn`) VALUES
('IF5C6U', 'admin', 'Government hospital Haveri', 'B+', 2, 'pavan', '7483022523', 'Routine', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 0, '', '2024-11-17 12:37:23', 0, '', NULL),
('FMUV75', 'admin', 'Government hospital Haveri', 'B+', 3, 'virat kohli', '7483022523', 'Routine', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 0, '', '2024-11-17 12:44:15', 0, '', NULL),
('WB6XD7', 'admin', 'Government hospital Haveri', 'B+', 6, 'pavan', '7483022523', 'Routine', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 0, '', '2024-11-17 12:50:29', 0, '', NULL),
('BQNJKG', 'admin', 'Government hospital Haveri', 'B+', 1, 'pavan', '7483022523', 'Critical', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 0, '', '2024-11-17 12:52:00', 0, '', NULL),
('G05RSI', '523GOV06', 'government hospital', 'B+', 3, 'pavan', '7483022523', 'Routine', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 0, '', '2024-11-17 15:42:28', 1, '523BP890', '2024-11-17 15:43:20');

-- --------------------------------------------------------

--
-- Table structure for table `blood_bank_registration`
--

CREATE TABLE `blood_bank_registration` (
  `bloodBankId` varchar(8) NOT NULL,
  `bloodBankName` varchar(100) NOT NULL,
  `bloodBankMobileNumber` varchar(15) NOT NULL,
  `bloodBankEmail` varchar(100) NOT NULL,
  `bloodBankState` varchar(50) NOT NULL,
  `bloodBankDistrict` varchar(50) NOT NULL,
  `bloodBankTaluq` varchar(50) DEFAULT NULL,
  `bloodBankCity` varchar(50) NOT NULL,
  `bloodBankAddress` text DEFAULT NULL,
  `bloodBankPassword` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blood_bank_registration`
--

INSERT INTO `blood_bank_registration` (`bloodBankId`, `bloodBankName`, `bloodBankMobileNumber`, `bloodBankEmail`, `bloodBankState`, `bloodBankDistrict`, `bloodBankTaluq`, `bloodBankCity`, `bloodBankAddress`, `bloodBankPassword`) VALUES
('523GOV06', 'government hospital', '7483022523', 'pavandvh27@gmail.com', 'Karnataka', 'Haveri', 'Haveri', 'Haveri', 'S/O: Chandrappa Siddeshwar Nagar At Devihosur Tq Haveri Devihosur Gundur Plot Haveri-Karnataka 581110', '12345696');

-- --------------------------------------------------------

--
-- Table structure for table `donarregistration`
--

CREATE TABLE `donarregistration` (
  `donarId` varchar(8) NOT NULL,
  `donarName` varchar(100) NOT NULL,
  `donarNumber` varchar(15) NOT NULL,
  `donarEmail` varchar(100) NOT NULL,
  `donarAge` int(11) NOT NULL,
  `donarBloodGroup` varchar(5) NOT NULL,
  `donarGender` enum('Male','Female','Other') NOT NULL,
  `donarState` varchar(50) NOT NULL,
  `donarDistrict` varchar(50) NOT NULL,
  `donarTaluq` varchar(50) DEFAULT NULL,
  `donarCity` varchar(50) NOT NULL,
  `donarAddress` text DEFAULT NULL,
  `donarPassword` varchar(255) NOT NULL,
  `donarAvailability` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donarregistration`
--

INSERT INTO `donarregistration` (`donarId`, `donarName`, `donarNumber`, `donarEmail`, `donarAge`, `donarBloodGroup`, `donarGender`, `donarState`, `donarDistrict`, `donarTaluq`, `donarCity`, `donarAddress`, `donarPassword`, `donarAvailability`) VALUES
('523BP890', 'Pavan Chandrappa Hottigoudra', '7483022523', 'pavandvh27@gmail.com', 21, 'B+', 'Male', 'Karnataka', 'Haveri', 'Haveri', 'Devihosur', 'ashwini nagar at devihosur', '12345678', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_bank_registration`
--
ALTER TABLE `blood_bank_registration`
  ADD UNIQUE KEY `bloodBankEmail` (`bloodBankEmail`);

--
-- Indexes for table `donarregistration`
--
ALTER TABLE `donarregistration`
  ADD UNIQUE KEY `donarEmail` (`donarEmail`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;