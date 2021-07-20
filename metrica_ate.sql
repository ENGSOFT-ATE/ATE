
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE metrica_ate;

CREATE TABLE IF NOT EXISTS `caminho` (
  `id_caminho` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(20) DEFAULT NULL,
  `def_usoO` varchar(20) DEFAULT NULL,
  `def_usoP` varchar(20) DEFAULT NULL,
  `subcaminhoO` varchar(50) DEFAULT NULL,
  `subcaminhoP` varchar(50) DEFAULT NULL,
  `idp` int(11) DEFAULT NULL,
  `ido` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_caminho`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `caminho`
--

INSERT INTO `caminho` (`id_caminho`, `descricao`, `def_uso`, `subcaminhoO`,`subcaminhoP`, `idp`, `ido`) VALUES
(1, 'Busca binária', '(1(7,8)V,v)', '1,2,3,4,5,7,8','1,2,3,4,5,7,8', 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `caso_teste`
--

CREATE TABLE IF NOT EXISTS `caso_teste` (
  `id_casoteste` int(11) NOT NULL AUTO_INCREMENT,
  `idprogramao` int(11) DEFAULT NULL,
  `idprogramap` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_casoteste`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;


INSERT INTO `caso_teste` (`id_casoteste`, `idprogramao`, `idprogramap`) VALUES
(1, 1, 1);

CREATE TABLE IF NOT EXISTS `dados_tm` (
  `id_dadostm` int(11) NOT NULL AUTO_INCREMENT,
  `linha` varchar(5) DEFAULT NULL,
  `num_equacao` varchar(1) DEFAULT NULL,
  `variavel_o` varchar(20) DEFAULT NULL,
  `puso_hexa_o` varchar(20) DEFAULT NULL,
  `variavel_p` varchar(20) DEFAULT NULL,
  `puso_hexa_p` varchar(20) DEFAULT NULL,
  `dado_hexa_var` varchar(20) DEFAULT NULL,
  `cuso_hexa_o` varchar(20) DEFAULT NULL,
  `cuso_hexa_p` varchar(20) DEFAULT NULL,
  `idvar` int(11) DEFAULT NULL,
  `idpuso` int(11) DEFAULT NULL,
  `idcuso` int(11) DEFAULT NULL,
  `idtestemesa` int(11) DEFAULT NULL,
  `idmutante` int(11) DEFAULT NULL,
  `cod_linha` text,
  PRIMARY KEY (`id_dadostm`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;


INSERT INTO `dados_tm` (`id_dadostm`, `linha`, `num_equacao`, `variavel_o`, `dado_hexa_o`, `variavel_p`, `dado_hexa_p`, `idvar`, `idpuso`, `idcuso`, `idtestemesa`, `idmutante`, `cod_linha`) VALUES
(1, '1', '2', 'valor', '28', 'valor', '28', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(2, '1', '2', 'tam', '5', 'tam', '5', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(3, '1', '2', 'v1', 'A', 'v1', 'A', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(4, '1', '2', 'v2', '14', 'v2', '14', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(5, '1', '2', 'v3', '1E', 'v3', '1E', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(6, '1', '2', 'v4', '28', 'v4', '28', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(7, '1', '2', 'v5', '32', 'v5', '32', 1, 1, 1, 1, 1, '/*1*/ int buscaBin (int valor, int tam, int v[]) {'),
(15, '2', '2', 'esq', '0', 'esq', '0', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(16, '2', '2', 'mid', '0', 'mid', '0', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(17, '2', '2', 'dir', '4', 'dir', '4', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(18, '2', '2', 'tam', '5', 'tam', '5', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(19, '2', '2', '=', '3D', '=', '3D', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(20, '2', '2', '=', '3D', '=', '3D', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(21, '2', '2', '-', '2D', '-', '2D', 1, 1, 1, 1, 1, '/*2*/ int esq = 0, mid, dir = tam-1;'),
(22, '3', '3', 'esq', '0', 'esq', '0', 1, 1, 1, 1, 1, '/*3*/ while (esq <= dir) {'),
(23, '3', '3', 'dir', '4', 'dir', '4', 1, 1, 1, 1, 1, '/*3*/ while (esq <= dir) {'),
(24, '3', '3', '<', '3C', '<', '3C', 1, 1, 1, 1, 1, '/*3*/ while (esq <= dir) {'),
(25, '3', '3', '=', '3D', '0', '0', 1, 1, 1, 1, 1, '/*3*/ while (esq <= dir) {');

CREATE TABLE IF NOT EXISTS `m_c_uso` (
  `id_cuso` int(11) NOT NULL AUTO_INCREMENT,
  `dt_teste_cuso` varchar(20) DEFAULT NULL,
  `dt_teste_cusp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_cuso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;



CREATE TABLE IF NOT EXISTS `m_p_uso` (
  `id_puso` int(11) NOT NULL AUTO_INCREMENT,
  `dt_teste_puso` varchar(20) DEFAULT NULL,
  `dt_teste_pusp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_puso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


CREATE TABLE IF NOT EXISTS `programa_o` (
  `id_o` int(11) NOT NULL AUTO_INCREMENT, 
  `codigo_o` blob(255),
  PRIMARY KEY (`id_o`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

SELECT * FROM programa_o;

INSERT INTO `programa_o` (`id_o`, `dt_codificacao`, `codigo_o`) VALUES
(1, 'busca binária', '/*1*/ int buscaBin (int valor, int tam, int v[]) {');

CREATE TABLE IF NOT EXISTS `programa_p` (
  `id_p` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_p` text,
  PRIMARY KEY (`id_p`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `programa_p` (`id_p`, `dt_implementacao`, `codigo_p`) VALUES
(3, 'bisca binária', '/*1*/ int buscaBin (int valor, int tam, int v[]) {');

SELECT * FROM programa_p; 
--
-- Estrutura da tabela `teste_mesa`
--

CREATE TABLE IF NOT EXISTS `teste_mesa` (
  `id_testemesa` int(11) NOT NULL AUTO_INCREMENT,
  `dt_testemesa` varchar(20) DEFAULT NULL,
  `iddados` int(11) DEFAULT NULL,
  `id_ct` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_testemesa`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- Extraindo dados da tabela `teste_mesa`
--

INSERT INTO `teste_mesa` (`id_testemesa`, `dt_testemesa`, `iddados`, `id_ct`) VALUES
(1, '22/06/2021', 1, 1);


CREATE TABLE IF NOT EXISTS `valores_ct` (
  `id_dadosct` int(11) NOT NULL AUTO_INCREMENT,
  `parametro` varchar(20) DEFAULT NULL,
  `valor` varchar(20) DEFAULT NULL,
  `id_casoteste` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_dadosct`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Extraindo dados da tabela `valores_ct`
--

INSERT INTO `valores_ct` (`id_dadosct`, `parametro`, `valor`, `id_casoteste`) VALUES
(1, 'valor', '40', 1),
(8, 'tam', '5', 1),
(9, 'v1', '10', 1),
(10, 'v2', '20', 1),
(11, 'v3', '30', 1),
(12, 'v4', '40', 1),
(13, 'v5', '50', 1);


CREATE TABLE IF NOT EXISTS `mutantes` (
  `id_mutante` int(11) NOT NULL AUTO_INCREMENT,
  `dt_mutante` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_mutante`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Estrutura da tabela `v_var`
--
SELECT * FROM caminho; 

CREATE TABLE IF NOT EXISTS `v_var` (
  `id_var` int(11) NOT NULL AUTO_INCREMENT,
  `dt_teste_varo` varchar(20) DEFAULT NULL,
  `dt_teste_varp` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_var`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;