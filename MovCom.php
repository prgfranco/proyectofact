<?
require("config/cnx.php");

try {////////////////////////////////////////////////////////////////////////////////////////////////// COMIENZO TRY //

mssql_query("begin transaction",$conexion) or die("Error SQL begin trans");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Detalle de Compras</title>
<style>
.lineareCom1{
	background-image:url(Movimientos/fondocompras1.png);
	background-repeat:repeat-x;
	font-family: "TPro";
	font-size:12px;
	font-weight:100;
	height:28px;
	width:679px;
	margin-top:2px;
}


</style>

<script>

function movpag_a_movcom(p){
	
	np = p - 1;
	document.getElementById("capa_movcom"+np).style.display="block";
	document.getElementById("capa_movcom"+p).style.display="none";

return false;
}

function movpag_b_movcom(p){

	np = p + 1;	
	document.getElementById("capa_movcom"+np).style.display="block";
	document.getElementById("capa_movcom"+p).style.display="none";
	
return false;
}

</script>
</head>

<body>
<div id="FondoCompras" style="position:absolute; top:4px; left:13px; z-index:1;">
	<img src="Movimientos/compras.png" />
</div>
<div style="position:absolute; top:57px; left:15px;">
<?

$_SESSION['ParSQL'] = "
	SELECT C.NplVen AS PLA, D.FAP AS FAP, A.MTN, A.DES, A.INI, A.FIN FROM ATURNOSH AS A 
	INNER JOIN APARPOS AS B ON B.ID = '".$_SESSION['ParPOS']."'
	INNER JOIN VENDEDORES AS C ON C.CodVen = B.OPE
	INNER JOIN ATURNOSO AS D ON D.PLA = C.NplVen
	WHERE A.MTN = D.MTN
	";
	
	$registros = mssql_query($_SESSION['ParSQL']) or die("Error SQL");
	rollback($registros);		
	
	if(mssql_num_rows($registros)==0){
		exit;
	}
	while ($reg=mssql_fetch_array($registros)){
	
		$PLA = $reg['PLA'];
		
	}
  $LUG = $_SESSION['ParLUG'];
  $OPE = $_SESSION['idsusua'];


	$_SESSION['ParSQL'] = "DELETE FROM APROVEN"; 
	$APROVEN = mssql_query($_SESSION['ParSQL']) or die("Error SQL");
	rollback($APROVEN);	

	$_SESSION['ParSQL'] = "SELECT  TIP, TCO, SUC, NCO,FEC, NOM, TOT, PLA, FPA 
							FROM PMAEFACT 
							WHERE ANU<>'A' AND PLA = ".$PLA." AND LUG = ".$LUG." AND CG='C' 
							ORDER BY FEC,TIP,TCO,SUC,NCO";
	
	$COMPRAS = mssql_query($_SESSION['ParSQL']) or die("Error SQL");
	rollback($COMPRAS);		
	while ($RCPA=mssql_fetch_array($COMPRAS)){
		
			$_SESSION['ParSQL'] = "INSERT INTO APROVEN (DES,DES2,DES3,DES4,SEC,IMC,ART,CAE,IME,CAC) VALUES 
				('".$RCPA['TCO']."-".$RCPA['TIP'].
				"', '".format($RCPA['SUC'],4,'0',STR_PAD_LEFT)."-".format($RCPA['NCO'],8,'0',STR_PAD_LEFT)."', '".$RCPA['NOM'].
				"','".$RCPA['FEC']."',".$RCPA['PLA'].",".$RCPA['TOT'].",".$RCPA['FPA'].",0,0,0)";
				$AINS = mssql_query($_SESSION['ParSQL']) or die("Error SQL");
				rollback($AINS);			

	}

$_SESSION['ParSQL'] = "SELECT * FROM APROVEN ORDER BY SEC,ART";
$R1TB = mssql_query($_SESSION['ParSQL']) or die("Error SQL");
rollback($R1TB);		

$c = 0;
$cc = 0;
$s = 1;
$t = 0;

while ($ATU=mssql_fetch_row($R1TB)){


$fecha = $ATU['9'];
$date = new DateTime($fecha);
$fecha = $date->format('d-m-Y');

	$c = $c + 1;
	$cc = $cc + 1;

	if ($c == 1){
		
			if($s == 1){
				$e = "block";
			}else{
				$e = "none";
			}
		
			echo "<div id=\"capa_movcom".$s."\" style=\"display:".$e."\">";
			
			if($s <> 1){
				?>

				<div id="AnteriorCom" style=" position:absolute; top:0px; left:674px;">
					<button class="StyBoton" onclick="return movpag_a_movcom(<?php echo $s; ?>)" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('AnteriorMov_Com','','otros/scr_arri-over.png',0)"><img src="otros/scr_arri-up.png" border="0" id="AnteriorMov_Com"/></button>
</div>
	
				<?
	
			}
	
			}
	
			?>
			<div class="lineareCom1" id="linea<? echo $cc; ?>">
				<table width="679" height="26" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td width="29" align="center"><? echo $cc; ?></td>
						<td width="41" align="center"><? echo $ATU['2']; ?></td>
						<td width="124" align="center"><? echo $ATU['7']; ?></td>
						<td width="99" align="center"><? echo $fecha; ?></td>
						<td width="156" align="center"><? echo $ATU['8']; ?></td>
						<td width="55" align="center"><? echo $ATU['0']; ?></td>
						<td width="88" align="center">
						<? 
						if($ATU['1'] == 1){
							echo "CONTADO";
						}else{
							echo "CTA. CORRIENTE";
						} ?></td>
						<td width="87" align="center"><? echo dec($ATU['6'],2); ?></td>
					</tr>
			  </table>
			</div>
			<?
			$t = $c;
			if ($c == 7){
	
			?>
	
			<div id="SiguienteCom<?php echo $s; ?>" style="position:absolute; top:178px;  left:674px;">
				<button class="StyBoton" onclick="return movpag_b_movcom(<?php echo $s; ?>);" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('SiguienteMov_Com','','otros/scr_aba-over.png',0)"><img src="otros/scr_aba-up.png" border="0" id="SiguienteMov_Com"/></button>
</div>
		
</div>

			<?php
		  
			$c = 0;
			$s = $s + 1;
			
	}
	
}
if ($t == 7){
	?>
	<script>
		SoloNone("SiguienteCom<?php echo $s-1; ?>");
    </script>
	<?
}
?>
</div>
		
</body>
</html>
<?

mssql_query("commit transaction") or die("Error SQL commit");

}catch(Exception $e){////////////////////////////////////////////////////////////////////////////////////////////////// FIN DE TRY //
	
	?>
	<script>
		jAlert('ERROR Reintente la operacion solicitada.', 'Debo Retail - Global Business Solution');
	</script>
	<?

exit;

}

?>