



CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `age` int(5) NOT NULL,
  `sex` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO `user` (`id`, `name`, `age`, `sex`) VALUES
( 'Denis', 25, 1),
( 'Alex', 30, 0),
( 'Egor', 20, 0);

