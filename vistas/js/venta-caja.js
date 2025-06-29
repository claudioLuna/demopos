cambiaTipoCbte();

$('.selectTipoCbte').change(function(){
	cambiaTipoCbte();
});

function cambiaTipoCbte(){
	if($('.selectTipoCbte').val() == 2 || $('.selectTipoCbte').val() == 3 || $('.selectTipoCbte').val() == 7 || $('.selectTipoCbte').val() == 8 || $('.selectTipoCbte').val() == 12 || $('.selectTipoCbte').val() == 13 || $('.selectTipoCbte').val() == 202 || $('.selectTipoCbte').val() == 203 || $('.selectTipoCbte').val() == 207 || $('.selectTipoCbte').val() == 208 || $('.selectTipoCbte').val() == 212 || $('.selectTipoCbte').val() == 213) {
		$('.lineaCbteAsociados').show();
		$('.nuevaCbteAsociado').prop('required',true);
	} else {
		$('.lineaCbteAsociados').hide();	
		$('.nuevaCbteAsociado').prop('required',false);
		$('.nuevaCbteAsociado').val('');
	} 
}

/*=============================================
QUITAR PRODUCTOS DE LA VENTA Y RECUPERAR BOTÓN
=============================================*/
var idQuitarProducto = [];

localStorage.removeItem("quitarProductoCaja");

$(".nuevoProductoCaja").on("click", "button.quitarProductoCaja", function() {

	$(this).parent().parent().parent().parent().remove();
	var idProducto = $(this).attr("quitarProductoCaja");

	/*=============================================
	ALMACENAR EN EL LOCALSTORAGE EL ID DEL PRODUCTO A QUITAR
	=============================================*/
	if(localStorage.getItem("quitarProductoCaja") == null){

		idQuitarProducto = [];
	
	} else {

		idQuitarProducto.concat(localStorage.getItem("quitarProductoCaja"))

	}

	idQuitarProducto.push({"idProducto":idProducto});

	localStorage.setItem("quitarProductoCaja", JSON.stringify(idQuitarProducto));

	$("#tablaVentas button.recuperarBoton[idProducto='"+idProducto+"']").removeClass('btn-default');

	$("#tablaVentas button.recuperarBoton[idProducto='"+idProducto+"']").addClass('btn-primary agregarProducto');

	if($(".nuevoProductoCaja").children().length == 0){

		var cero = 0;

		$("#nuevoImpuestoVentaCaja").val(cero.toFixed(2));
		$("#nuevoPrecioNetoCaja").val(cero.toFixed(2));
		$("#nuevoTotalVentaCaja").val(cero.toFixed(2));
		$("#totalVentaCaja").val(cero.toFixed(2));
		$("#totalVentaMetodoPagoCaja").val(cero.toFixed(2));
		$("#nuevoTotalVentaCaja").attr("total",cero.toFixed(2));
		$("#nuevoInteresPrecioCaja").val(cero.toFixed(2));
		$("#nuevoDescuentoPrecioCaja").val(cero.toFixed(2));
		$("#nuevoPrecioNetoCajaForm").val(cero.toFixed(2));
		$("#listaProductosCaja").val('');

	} else {

		// SUMAR TOTAL DE PRECIOS
    	sumarTotalPreciosCaja();

    	// AGREGAR IMPUESTO
        agregarImpuestoCaja();

        // CALCULAR SI HAY DESCUENTO
        calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

        // CALCULAR SI HAY INTERES
        calcularInteresCaja("nuevoInteresPorcentajeCaja");

	}

    // AGRUPAR PRODUCTOS EN FORMATO JSON
    listarProductosCaja();

});

/*=============================================
SUMAR TODOS LOS PRECIOS
=============================================*/
function sumarTotalPreciosCaja(){

	var precioItem = $(".nuevoPrecioProductoCaja");

	var arraySumaPrecio = [];  

	for(var i = 0; i < precioItem.length; i++){

		 arraySumaPrecio.push(Number($(precioItem[i]).val()));

	}
	
    //en el caso que no haya ningun producto seleccionado, agrego cero (sino se rompe reduce)
	if(arraySumaPrecio.length === 0){ 
		arraySumaPrecio.push(0);
	}	

	function sumaArrayPrecios(total, numero){
		return total + numero;
	}

	var sumaTotalPrecioCaja = arraySumaPrecio.reduce(sumaArrayPrecios);
	//sumaTotalPrecioCaja = Math.floor(sumaTotalPrecioCaja * 100) / 100;
	sumaTotalPrecioCaja = Math.ceil(sumaTotalPrecioCaja * 100) / 100;

	$("#nuevoTotalVentaCaja").val(sumaTotalPrecioCaja);
	$("#nuevoPrecioNetoCaja").val(sumaTotalPrecioCaja);
	$("#totalVentaCaja").val(sumaTotalPrecioCaja);
	$("#nuevoTotalVentaCaja").attr("total",sumaTotalPrecioCaja);
	//$("#totalVentaMetodoPagoCaja").val(sumaTotalPrecioCaja); //////???
	$("#nuevoPrecioNetoCajaForm").val(sumaTotalPrecioCaja);

	// CALCULO Y SEPARO TIPOS DE IVA
	var calculoIva = $(".nuevoTipoIvaValorProducto");
	var arrayIva = [];
	//var iva0 = 0;
	var bimp0 = 0;
	var iva2 = 0;
	var bimp2 = 0;
	var iva5 = 0;
	var bimp5 = 0;
	var iva10 = 0;
	var bimp10 = 0;
	var iva21 = 0;
	var bimp21 = 0; 
	var iva27 = 0;
	var bimp27 = 0;
	var baseImp = 0;
	var valIva = 0;
	for(var x = 0; x < calculoIva.length; x++){

		valIva = Number($(calculoIva[x]).val())  * Number($(calculoIva[x]).attr('cantxIva'));
		console.log("IVA: " + valIva);
		baseImp = Number($(calculoIva[x]).attr('netoUnitario')) * Number($(calculoIva[x]).attr('cantxIva'));
		console.log('BASE IMP: ' + baseImp);

		switch($(calculoIva[x]).attr('tipoIva')) {
			case "0":
				//iva0 = iva0 + Number($(calculoIva[x]).val());
				bimp0 = bimp0 + baseImp;
				break;
			case "2.5":
				iva2 = iva2 + valIva;
				bimp2 = bimp2 + baseImp;
				break;
			case "5":
				iva5 = iva5 + valIva;
				bimp5 = bimp5 + baseImp;
				break;
			case "10.5":
				iva10 = iva10 + valIva;
				bimp10 = bimp10 + baseImp;
				break;
			case "21":
				iva21 = iva21 + valIva;
				bimp21 = bimp21 + baseImp;
				break;
			case "27":
				iva27 = iva27 + valIva;
				bimp27 = bimp27 + baseImp;
				break;
		}

	}

	$("#nuevoVtaCajaBaseImp0").val(bimp0);
	$("#nuevoVtaCajaIva2").val(iva2);
	$("#nuevoVtaCajaBaseImp2").val(bimp2);
	$("#nuevoVtaCajaIva5").val(iva5);
	$("#nuevoVtaCajaBaseImp5").val(bimp5);
	$("#nuevoVtaCajaIva10").val(iva10);
	$("#nuevoVtaCajaBaseImp10").val(bimp10);
	$("#nuevoVtaCajaIva21").val(iva21);
	$("#nuevoVtaCajaBaseImp21").val(bimp21);
	$("#nuevoVtaCajaIva27").val(iva27);
	$("#nuevoVtaCajaBaseImp27").val(bimp27);

}

/*=============================================
FUNCION CALCULAR DESCUENTOS
=============================================*/
function calcularDescuentoCaja(elem){

	// if($("#nuevoMetodoPagoCaja").val() == "Efectivo" || $("#nuevoMetodoPagoCaja").val() == "TD") {
		var precioNeto = Number($("#nuevoPrecioNetoCaja").val());
		var descuentoPorcentaje = Number($("#nuevoDescuentoPorcentajeCaja").val());
		var descuentoPrecio = Number($("#nuevoDescuentoPrecioCaja").val());
		var totalConDescuento = 0;

		if(elem == "nuevoDescuentoPorcentajeCaja"){
			//llamado desde importe de descuento
			var nuevoDescPrec = descuentoPorcentaje * precioNeto / 100;
			$("#nuevoDescuentoPrecioCaja").val(nuevoDescPrec.toFixed(2));
			totalConDescuento = precioNeto - nuevoDescPrec;
    	} else {
			//llamado desde importe de precio
			var nuevoDescPorc = descuentoPrecio * 100 / precioNeto;
			$("#nuevoDescuentoPorcentajeCaja").val(nuevoDescPorc.toFixed(2));
			totalConDescuento = precioNeto - descuentoPrecio;
		}

        totalConDescuento = Math.ceil(totalConDescuento * 100) / 100;
		$("#nuevoTotalVentaCaja").val(totalConDescuento);
		$("#totalVentaCaja").val(totalConDescuento);
		$("#nuevoTotalVentaCaja").attr("total",totalConDescuento);
		$("#totalVentaMetodoPagoCaja").val(totalConDescuento);

	// }

}

/*=============================================
CAMBIO DESCUENTO
=============================================*/
$(".nuevoDescuentoCaja").bind("keyup", function(e){

	var desdeElemento = e.currentTarget.id;

	calcularDescuentoCaja(desdeElemento);

});

/*=============================================
FUNCION CALCULAR INTERES
=============================================*/
function calcularInteresCaja(elem){

	if($("#nuevoMetodoPagoCaja").val() == "TC") {

		var precioNeto = $("#nuevoPrecioNetoCaja").val();

		var interesPorcentaje = $("#nuevoInteresPorcentajeCaja").val();

		var interesPrecio = $("#nuevoInteresPrecioCaja").val();

		var totalConInteres = 0;

		if(elem == "nuevoInteresPorcentajeCaja"){
			//llamado desde importe de descuento

			var nuevoIntPrec = Number(interesPorcentaje * precioNeto / 100);

			$("#nuevoInteresPrecioCaja").val(nuevoIntPrec.toFixed(2));

			totalConInteres = Number(precioNeto) + Number(nuevoIntPrec);
		
		} else {
			//llamado desde importe de precio

			var nuevoIntPorc = Number(interesPrecio * 100 / precioNeto);

			$("#nuevoInteresPorcentajeCaja").val(nuevoIntPorc.toFixed(2));

			totalConInteres = Number(precioNeto) + Number(interesPrecio);

		}

		$("#nuevoTotalVentaCaja").val(Number(totalConInteres).toFixed(2));
		$("#totalVentaCaja").val(Number(totalConInteres).toFixed(2));
		$("#nuevoTotalVentaCaja").attr("total",totalConInteres);
		$("#totalVentaMetodoPagoCaja").val(Number(totalConInteres).toFixed(2));
	}

}

/*=============================================
CAMBIO INTERES
=============================================*/
$(".nuevoInteresCaja").bind("keyup", function(e){

	var desdeElemento = e.currentTarget.id;

	calcularInteresCaja(desdeElemento);

});

/*=============================================
FORMATO AL PRECIO FINAL
=============================================*/

//$("#nuevoTotalVentaCaja").number(true, 2); ///???

/*=============================================
SELECCIONAR MÉTODO DE PAGO
=============================================*/
$("#nuevoMetodoPagoCaja").change(function(){

	cambiarMetodoPagoCaja($(this));

});

/*=============================================
FUNCION CAMBIO METODO DE PAGO
=============================================*/
function cambiarMetodoPagoCaja(valorMetodo){

	var cero = 0;

	var metodo = valorMetodo.val();

	var precioTotal = $("#nuevoPrecioNetoCaja").val();

	$("#listaMetodoPagoCaja").val('');

	var estoyEditandoMx = 0;

	//Crear-venta = 0 y editar-venta = 1. 
	//Si ingreso a editar venta la primera carga necesito que no llame a la funcion limpiarCajasMedioPago, 
	//pero una vez que carga todos los valores, pongo estoyEditando en 0 para que entre a la funcion limpiar...

	if($("#estoyEditandoCaja").val() == 0) {

		limpiarCajasMedioPagoCaja();

	} else {

		$("#estoyEditandoCaja").val(0);
		
		if (metodo == "Mixto") {

			estoyEditandoMxCaja = 1;

		}

	}

	$("#nuevoTotalVentaCaja").val(precioTotal);

	valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
	
	 	'<div class="col-xs-6" style="padding-left:0px">'+

        '</div>');

	if(metodo == "Efectivo") {

		$("#filaDescuentoCaja").css("display", ""); //Muestro Fila con inputs de descuento

		var totalConImpuesto = Number(precioTotal);

		$("#nuevoTotalVentaCaja").val(totalConImpuesto.toFixed(2));

		$("#totalVentaCaja").val(totalConImpuesto.toFixed(2));

		$("#nuevoPrecioImpuestoCaja").val(cero.toFixed(2)); //PARA QUE SE USA????

		valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
			'<div class="col-md-3">'+
				'<div class="input-group">'+
					'<span class="input-group-addon" style="background-color: #eee">Entrega</span>'+
					'<input type="text" class="form-control" onkeyup="cambioCalculo(this.value);" >'+
				'</div>'+
	      	'</div>'+
			'<div class="col-xs-3" style="padding-left:0px">'+	
				'<div class="input-group">'+
					'<span class="input-group-addon" style="background-color: #eee">Vuelto</span>'+
					'<input type="text" class="form-control" id="cambio">'+
				'</div>'+
	        '</div>');
		$("#nuevoDescuentoPorcentajeCaja").keyup();

	}

	
	if(metodo == "MP") {
		$("#filaDescuentoCaja").css("display", "");
		$("#nuevoTotalVentaCaja").val(precioTotal);
		valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
		 '<div class="col-xs-3" style="padding-left:0px">'+
		    '<div class="input-group">'+
		      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-lock"></i></span>'+
		      '<input type="text" class="form-control inputsMetodosPago" id="nuevoCodigoTransaccionCaja" placeholder="Control">'+
		    '</div>'+
          '</div>');
		$("#nuevoDescuentoPorcentajeCaja").keyup();

	}
	if(metodo == "TD") {
		$("#filaDescuentoCaja").css("display", "");
		$("#nuevoTotalVentaCaja").val(precioTotal);
		valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
		 '<div class="col-xs-3" style="padding-left:0px">'+
		    '<div class="input-group">'+
		      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-lock"></i></span>'+
		      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="nuevoCodigoTransaccionCaja" placeholder="Control">'+
		    '</div>'+
          '</div>');
		$("#nuevoDescuentoPorcentajeCaja").keyup();

	}

	if(metodo == "TC") {
    	$("#filaInteres").css("display", "");
		$("#nuevoTotalVentaCaja").val(precioTotal);
		valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
		  '<div class="col-xs-3" style="padding-left:0px">'+
		    '<div class="input-group">'+
		      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-lock"></i></span>'+
		      '<input type="text" class="form-control inputsMetodosPago" id="nuevoCodigoTransaccionCaja" placeholder="Control">'+
		    '</div>'+
          '</div>');
		$("#nuevoInteresPorcentajeCaja").keyup();
	}

	if(metodo == "TR"){ //Transferencia
		valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
		  '<div class="col-xs-3" style="padding-left:0px">'+
		    '<div class="input-group">'+
		      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-bank"></i></span>'+
		      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="bancoOrigenTransferencia" placeholder="Banco origen">'+
		    '</div>'+
		  '</div>' + 

		  '<div class="col-xs-3" style="padding-left:0px">'+
		    '<div class="input-group">'+
		      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-lock"></i></span>'+
		      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="numeroReferenciaTransferencia" placeholder="N° referencia">'+
		    '</div>'+
		  '</div>');
	}

	if(metodo == "CH"){ //Cheque
	  valorMetodo.parent().parent().parent().children('.cajasMetodoPagoCaja').html(
	  '<div class="col-xs-3" style="padding-left:0px">'+
	    '<div class="input-group">'+
	      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-bank"></i></span>'+
	      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="bancoOrigenCheque" placeholder="Banco origen">'+
	    '</div>'+
	  '</div>' + 
	  '<div class="col-xs-3" style="padding-left:0px">'+
	    '<div class="input-group">'+
	      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-lock"></i></span>'+
	      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="numeroCheque" placeholder="N° cheque">'+
	    '</div>'+
	  '</div>' +
	  
	  '<div class="col-xs-3" style="padding-left:0px">'+
	    '<div class="input-group">'+
	      '<span class="input-group-addon" style="background-color: #eee"><i class="fa fa-calendar"></i></span>'+
	      '<input autocomplete="off" type="text" class="form-control inputsMetodosPago" id="fechaCheque" placeholder="Fecha Vto. (dd/mm/aaaa)">'+
	    '</div>'+
	  '</div>');
	}  

	if(metodo == "CC"){
		if($("#seleccionarCliente").val()==1){
			swal({
			      title: "Ventas",
			      text: "Debe seleccionar cliente",
			      type: "error",
			      confirmButtonText: "¡Cerrar!"
			    });
			$("#nuevoMetodoPagoCaja").prop("selectedIndex", 0);
			return false;
		}
		$("#nuevoTotalVentaCaja").val(precioTotal);
	}
	listarMetodosCaja();

}

/*=============================================
FUNCION LIMPIAR MEDIOS DE PAGO
=============================================*/
function limpiarCajasMedioPagoCaja(){

	var cero = 0;

	//Oculto filas descuento e interes
	$("#filaInteresCaja").css("display", "none");
	$("#filaDescuentoCaja").css("display", "none");

	//Reseteo cajas descuento
	$("#nuevoDescuentoPorcentajeCaja").val(cero.toFixed(2));
	$("#nuevoDescuentoPrecioCaja").val(cero.toFixed(2));
	
	//Reseteo cajas interes
	$("#nuevoInteresPorcentajeCaja").val(cero.toFixed(2));
	$("#nuevoInteresPrecioCaja").val(cero.toFixed(2));
	
	//Reseteo cajas total
	$("#totalVentaMetodoPagoCaja").val($('#nuevoPrecioNetoCaja').val());
	$("#totalVentaCaja").val($('#nuevoPrecioNetoCaja').val());
	$("#nuevoTotalVentaCaja").val($('#nuevoPrecioNetoCaja').val());
}

/*=============================================
CAMBIO TRANSACCIÓN
=============================================*/
$(".cajasMetodoPagoCaja").on("change", "input.inputsMetodosPago", function(){
     listarMetodosCaja();
});


$('#nuevoInteresPorcentajeCaja').keyup(function(){
	calcularInteresCaja("nuevoInteresPorcentajeCaja");
});

/*=============================================
FUNCION CALCULAR INTERES POR TARJETA DE CREDITO
=============================================*/
function calcularInteresAutomaticoCaja(){

	$('#nuevoInteresPorcentajeCaja').val($('#cuotasTarjetasCaja').find(':selected').attr('interesCuota')).keyup();

	listarMetodosCaja();
}


$(".nuevoProductoCaja").on('change', '.nuevaDescripcionProductoCaja', function(){
    
    listarProductosCaja();
});

/*=============================================
LISTAR TODOS LOS PRODUCTOS
=============================================*/
function listarProductosCaja(){
	var listaProductosCaja = [];
	var descripcion = $(".nuevaDescripcionProductoCaja");
	var cantidad = $(".nuevaCantidadProductoCaja");
	var precio = $(".nuevoPrecioProductoCaja");
	var categoria = $(".nuevaCategoria");
	for(var i = 0; i < descripcion.length; i++){
		listaProductosCaja.push({ 	"id" : $(descripcion[i]).attr("idProducto"), 
									"descripcion" : $(descripcion[i]).val(),
									"cantidad" : $(cantidad[i]).val(),
									"categoria" : $(categoria[i]).val(),
									"stock" : $(cantidad[i]).attr("nuevoStock"),
									"precio_compra" : $(precio[i]).attr("precioCompra"),
									"precio" : $(precio[i]).attr("precioReal"),
									"total" : $(precio[i]).val()})
	}
	$("#listaProductosCaja").val(JSON.stringify(listaProductosCaja));
}

/*=============================================
LISTAR MÉTODO DE PAGO
=============================================*/
function listarMetodosCaja(){
	var listarMetodosCaja = "";
	switch($("#nuevoMetodoPagoCaja").val()) {
		case "Efectivo":
			$("#listaMetodoPagoCaja").val("Efectivo");
    	break;
    	case "MP":
	    	$("#listaMetodoPagoCaja").val("MP-"+$("#nuevoCodigoTransaccionCaja").val());
	    break;
	 	case "TD":
	    	$("#listaMetodoPagoCaja").val("TD-"+$("#nuevoCodigoTransaccionCaja").val());
	    break;
	    case "TC":
    		//var tarNom = ($("#seleccionarTarjeta").val() != "") ? '-'+$("#seleccionarTarjeta").val() : '';
    		//var tarCuo = ($("#cuotasTarjetasCaja option:selected").text() != "") ? "-"+$("#cuotasTarjetasCaja option:selected").text() : '';
    		//$("#listaMetodoPagoCaja").val($("#nuevoMetodoPagoCaja").val()+tarNom+tarCuo+"-"+$("#nuevoCodigoTransaccionCaja").val());
    		$("#listaMetodoPagoCaja").val("TC-"+$("#nuevoCodigoTransaccionCaja").val());
	    break;
	    case "CH":
	    	$("#listaMetodoPagoCaja").val("CH-"+$("#bancoOrigenCheque").val()+"-"+$("#numeroCheque").val()+"-"+$("#fechaCheque").val());
	    break;
		case "TR":
	    	$("#listaMetodoPagoCaja").val("TR-"+$("#bancoOrigenTransferencia").val()+"-"+$("#numeroReferenciaTransferencia").val());
	    break;
		case "CC":
	    	$("#listaMetodoPagoCaja").val("CC");
	    break;

	}
}

/*=============================================
FUNCIÓN PARA DESACTIVAR LOS BOTONES AGREGAR CUANDO EL PRODUCTO YA HABÍA SIDO SELECCIONADO EN LA CARPETA
=============================================*/
function quitarAgregarProductoCaja(){

	//Capturamos todos los id de productos que fueron elegidos en la venta
	var idProductos = $(".quitarProducto");

	//Capturamos todos los botones de agregar que aparecen en la tabla
	var botonesTabla = $(".tablaVentas tbody button.agregarProducto");

	//Recorremos en un ciclo para obtener los diferentes idProductos que fueron agregados a la venta
	for(var i = 0; i < idProductos.length; i++){

		//Capturamos los Id de los productos agregados a la venta
		var boton = $(idProductos[i]).attr("idProducto");
		
		//Hacemos un recorrido por la tabla que aparece para desactivar los botones de agregar
		for(var j = 0; j < botonesTabla.length; j ++){

			if($(botonesTabla[j]).attr("idProducto") == boton){

				$(botonesTabla[j]).removeClass("btn-primary agregarProducto");
				$(botonesTabla[j]).addClass("btn-default");

			}
		}
	}
}


/*=============================================
IMPRIMIR FACTURA
=============================================*/
$(".tablas").on("click", ".btnImprimirFacturaCaja", function(){
	var codigoVenta = $(this).attr("codigoVenta");
	window.open("extensiones/vendor/tecnickcom/tcpdf/pdf/factura.php?codigo="+codigoVenta, "_blank");
	
});

/*=============================================
AGREGAR PRODUCTO DESDE PANEL DERECHO - INPUT DETALLE
=============================================*/
$("#ventaCajaDetalle").keyup( function (e) {
    if (e.keyCode == 13 ) {
    	agregarProductoListaCompra();
	} 
	if (e.keyCode == 37) {
		document.getElementById('ventaCajaCantidad').focus();
	}
});

/*=============================================
AGREGAR PRODUCTO DESDE PANEL DERECHO - INPUT CANTIDAD
=============================================*/
$("#ventaCajaCantidad").keyup( function (e) {
    if (e.keyCode == 39 ) {
		document.getElementById('ventaCajaDetalle').focus();
	}
	if(e.keyCode == 13) {
		agregarProductoListaCompra();
	}
});

function borrarCodigoOculto(valor){
	if(valor.length == 0){
		document.getElementById("ventaCajaDetalleHidden").value = "";
	}
}

async function esperarPrecio(precio){

	return parseFloat(precio);

}

function agregarProductoListaCompra() {
    
    var cantEnDetalle = $("#ventaCajaDetalle").val();

    if(cantEnDetalle.includes('*')){
        cantEnDetalle = cantEnDetalle.split('*');
        $("#ventaCajaCantidad").val(cantEnDetalle[0]);
        $("#ventaCajaDetalle").val(cantEnDetalle[1])
    }
    
    /* DESCOMENTAR FUNCION SI UTILIZAN BALANZA PARA INCLUIR CODIGOS PESABLES EAN-13 2-5-5-1
    //  2 - CODIGO INTERNO (EJ: 20)
    //  5 - CODIGO PRODUCTO
    //  5 - PESO EN GRAMOS
    //  1 - DIGITO VERIFICADOR (ESTE LO DESESTIMAMOS)
    */
    if (/^\d{13}$/.test(cantEnDetalle) && cantEnDetalle.substring(0, 2) == '20') {
        //let vendorId = cantEnDetalle.substring(0, 2);
        $("#ventaCajaDetalle").val(cantEnDetalle.substring(2, 7));
        let kilogramos = Number(cantEnDetalle.substring(7, 12)) / 1000; //divido el peso por mil para obtener los kg 
        $("#ventaCajaCantidad").val(kilogramos);
    }
    
    

	if($("#ventaCajaDetalleHidden").val()!=""){
		var idProductoDos = $("#ventaCajaDetalleHidden").val();
		var cantidadDos = $("#ventaCajaCantidad").val();
	} else {
		var idProductoDos = $("#ventaCajaDetalle").val();
		var cantidadDos = $("#ventaCajaCantidad").val();	
	}

	var idProducto = idProductoDos;
	var cantidad = cantidadDos;
	
	if(cantidad > 1000) {
	    swal({
	      title: "Ventas",
	      text: "Advertencia, se han seleccionado mas de 1000 unidades del producto",
	      type: "warning",
	      toast: true,
    	  timer: 3000,
    	  position: 'top',
	      confirmButtonText: "¡Cerrar!"
		});
		var audio = new Audio('vistas/dist/sound/alarm.mp3');
        audio.play();
	}

	if(idProductoDos == "" || idProductoDos == undefined) {

		swal({
	      title: "Ventas",
	      text: "Error, no se ha seleccionado ningun producto",
	      type: "error",
	      toast: true,
    	  timer: 3000,
    	  position: 'top',
	      confirmButtonText: "¡Cerrar!"
		});
		return;

	} else {

	    var stockSucursal = $("#sucursalVendedor").val();

	    //tipo de precio seleccionado (según lista precio)
		//var tipoPrecio = $('input[name=radioPrecio]:checked').val(); 
		var tipoPrecio = $('#radioPrecio').val(); 
        
        if(stockSucursal == "" || tipoPrecio == ""){
            swal({
        	   title: "Error",
        	   text: "El usuario debe definir sucursal y lista de precio",
        	   toast: true,
        	   timer: 3000,
        	   position: 'top',
        	   type: "error",
        	   confirmButtonText: "¡Cerrar!"
        	 });
        	return;
        }
        
		var datos = new FormData();
	    datos.append("codigoProducto", idProducto);
	    
	    var mobileDevice = false;
        if (window.matchMedia("(max-width: 600px)").matches)  { 
            mobileDevice = true;
            console.log("This is a mobile device.");
            $("#divCabeceraPrecioTotal").removeClass("col-xs-2");
            $("#divCabeceraPrecioTotal" ).addClass("col-xs-4");
        } 
        
        var cargarProductoSegunVista;

 		$.ajax({

	     	url:"ajax/productos.ajax.php",
	      	method: "POST",
	      	data: datos,
	      	cache: false,
	      	contentType: false,
	      	processData: false,
	      	dataType:"json",
	      	success:function(respuesta) {

	      		if(respuesta) {

	      			var precioVta = 0;
					var precioNeto = 0;
	          		var iva = Number(respuesta["tipo_iva"]);
	          		var ivaValor = 0;
	      			var stock = respuesta[stockSucursal]; //TOMO EL STOCK DE LA SUCURSAL ASIGNADA AL USUARIO LOGUEADO

	      			if(respuesta[tipoPrecio] == 0) {

						(async()=> {
							const { value: formValues } = await swal({
							  title: 'Ingrese importe',
							  html:'<p>'+respuesta["codigo"]+'-'+respuesta["descripcion"]+'</p> <div class="input-group"><span class="input-group-addon"><i class="ion ion-social-usd"></i></span><input type="number" id="swal-input1" class="form-control" ></div>',
							  focusConfirm: false,
							  preConfirm: () => {
							    const promesa =  new Promise((resolve, reject) => { 
							    	resolve (document.getElementById('swal-input1').value); 
							    });

							    promesa.then(values => {

							    values = Number(values);
							    precioNeto = (values / ((iva / 100) + 1)) * cantidad; //obtengo el neto
							    ivaValor = (values * cantidad) - precioNeto;          //obtengo el iva

							 	//ACTUALIZO EN LA BD EL NUEVO PRECIO INTRODUCIDO 
		    					//RESERVADOS LOS CODIGOS DEL 1 AL 10 PARA (VARIOS, CARNE, PAN, ETC)
		    					/*
		    					if(idProducto != 1 && idProducto != "1" && 
		    						idProducto != 2 && idProducto != "2" && 
		    						idProducto != 3 && idProducto != "3" && 
		    						idProducto != 4 && idProducto != "4" && 
		    						idProducto != 5 && idProducto != "5" && 
		    						idProducto != 6 && idProducto != "6" && 
		    						idProducto != 7 && idProducto != "7" && 
		    						idProducto != 8 && idProducto != "8" && 
		    						idProducto != 9 && idProducto != "9" && 
		    						idProducto != 10 && idProducto != "10") {

		    							//var tipoPrecio = $('input[name=radioPrecio]:checked').val();
                                        var tipoPrecio = $("#radioPrecio").val();
                                        
				    					var datosActualizarPrecio = new FormData();
									    datosActualizarPrecio.append("actualizarPrecio", 1);
									    datosActualizarPrecio.append("codigoProducto", idProducto);
									    datosActualizarPrecio.append(tipoPrecio, values);

								 		$.ajax({

									     	url:"ajax/productos.ajax.php",
									      	method: "POST",
									      	data: datosActualizarPrecio,
									      	cache: false,
									      	contentType: false,
									      	processData: false,
									      	dataType:"json",
									      	success:function(respuestaActualizar) {
									      		console.log(respuestaActualizar);
									      	},
											error: function(xhr, status, error) {
											  
											 	console.log(status);
												console.log( xhr.responseText);
												console.log( error);
											}

									      })
								}*/
								
								if(mobileDevice) {
                                    
                                   cargarProductoSegunVista = '<div class="row" style="padding-left:25px;padding-bottom:5px;">'+
        
                						 '<!-- Cantidad del producto -->'+
                				          '<div class="col-xs-2 nuevaCantidad">'+
                				             '<input type="text" autocomplete="off" style="text-align:center;" class="form-control input-sm nuevaCantidadProductoCaja" stock="0" nuevoStock="0" min="0" value="'+cantidad+'" readonly>'+
                				          '</div>'+
                						  
                						  '<!-- Descripción del producto -->'+				          
                				          '<div class="col-xs-6" >'+
                				            '<div class="input-group">'+
                				              '<span class="input-group-btn"><button type="button" class="btn btn-danger btn-sm quitarProductoCaja" idProducto="'+respuesta['id']+'"><i class="fa fa-times"></i></button></span>'+
        						              '<input type="text" autocomplete="off" class="form-control input-sm nuevaDescripcionProductoCaja" idProducto="'+respuesta['id']+'" value="'+respuesta['descripcion']+'" required>'+
        									  '<input type="hidden" class="nuevaCategoria" value="'+respuesta["id_categoria"]+'">'+
                				            '</div>'+
                				          '</div>'+
                
                						  '<!-- precio unitario del producto -->'+
                				          '<div class="col-xs-2 nuevoPrecio" style="display: none">'+
                					            '<input type="text" style="text-align:center;" class="form-control input-sm nuevaPrecioUnitario" value="'+values+'"  required>'+
                							'</div>'+
                							 
                				          '<!-- Precio total del producto -->'+
                				          '<div class="col-xs-4 ingresoPrecio" >'+
                			  				  '<input type="hidden" class="nuevoTipoIvaValorProducto" value="'+ivaValor+'" netoUnitario="'+precioNeto+'" tipoIva="'+iva+'" cantxIva="1">'+
   						                      '<input type="hidden" class="nuevoValorTipoIva" value="'+iva+'">'+
    									      '<input type="text" class="form-control input-sm nuevoPrecioProductoCaja" precioReal="'+values+'" precioCompra="'+respuesta["precio_compra"]+'" style="text-align:center;" value="'+redondear(values*cantidad)+'" required>'+
                				          '</div>'+
                
                				        '</div>';
        
                                } else {
								
    								cargarProductoSegunVista = '<div class="row" style="padding-left:25px;padding-bottom:5px;">'+
    
        						         '<!-- Cantidad del producto -->'+
        						          '<div class="col-xs-2 nuevaCantidad">'+						            
        						             '<input type="text" autocomplete="off" style="text-align:center;" class="form-control input-sm nuevaCantidadProductoCaja" stock="0" nuevoStock="0" min="0" value="'+cantidad+'" required>'+
        						          '</div>'+
        
        								'<!-- descripcion producto -->'+
        								 '<div class="col-xs-6" style="padding-right:0px">'+
        						            '<div class="input-group">'+						              
        						              '<span class="input-group-btn"><button type="button" class="btn btn-danger btn-sm quitarProductoCaja" idProducto="'+respuesta['id']+'"><i class="fa fa-times"></i></button></span>'+
        						              '<input type="text" autocomplete="off" class="form-control input-sm nuevaDescripcionProductoCaja" idProducto="'+respuesta['id']+'" value="'+respuesta['descripcion']+'" required>'+
        									  '<input type="hidden" class="nuevaCategoria" value="'+respuesta["id_categoria"]+'">'+
        						            '</div>'+
        						          '</div>'+
        
        								'<!-- precio unitario -->'+
        								'<div class="col-xs-2 nuevoPrecio">'+
        								   '<div class="input-group">'+
        						             '<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+
        									 '<input type="text" style="text-align:center;" class="form-control input-sm nuevaPrecioUnitario" value="'+values+'"  required>'+
        								  '</div>'+
        								'</div>'+
        
        						          '<!-- Precio total -->'+
        						          '<div class="col-xs-2 ingresoPrecio" style="padding-left:0px">'+
        						            '<div class="input-group">'+
        						              '<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+
        					  				  '<input type="hidden" class="nuevoTipoIvaValorProducto" value="'+ivaValor+'" netoUnitario="'+precioNeto+'" tipoIva="'+iva+'" cantxIva="1">'+
        						              '<input type="hidden" class="nuevoValorTipoIva" value="'+iva+'">'+
        									  '<input type="text" class="form-control input-sm nuevoPrecioProductoCaja" precioReal="'+values+'" precioCompra="'+respuesta["precio_compra"]+'" style="text-align:center;" value="'+redondear(values*cantidad)+'" required>'+
        						            '</div>'+
        						          '</div>'+
        
        						        '</div>';
                                }
								
		    					$(".nuevoProductoCaja").prepend( cargarProductoSegunVista );

							    })

							  }
							})

						sumarTotalPreciosCaja();

						//CALCULAR SI HAY DESCUENTO
				        calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

				        //CALCULAR SI HAY INTERES
				        calcularInteresCaja("nuevoInteresPorcentajeCaja");

				        // PONER FORMATO AL PRECIO DE LOS PRODUCTOS
						listarProductosCaja();

						//RESETEO METODO DE PAGO
		        		$("#nuevoMetodoPagoCaja").prop("selectedIndex", 0).change();

				        $(".nuevoPrecioProductoCaja").number(true, 2);

						localStorage.removeItem("quitarProductoCaja");

						$("#ventaCajaDetalleHidden").val("");
						$("#ventaCajaDetalle").val("");
						$("#autocompletarProducto").val("");
						$("#ventaCajaCantidad").val("1");
						$("#ventaCajaDetalle").focus();						

						})()

	      			} else {

                        //SI NO HAY STOCK NO DEJO AGREGAR PRODUCTO
                        //if(respuesta["stock"] <= 0){
        	      			//swal({
        				    //   title: "No hay stock disponible",
        				    //   toast: true,
        				    //   timer: 3000,
        				    //   position: 'top',
        				    //   type: "error",
        				    //   confirmButtonText: "¡Cerrar!"
        				    // });
        				    //return;
        	          	//}
        	          	
        	          	/*
        	          	var estaElProducto = JSON.parse($("#listaProductosCaja").val());
        	          	console.log(estaElProducto)
        	          	estaElProducto.filter(function (estaElProducto) { 
        	          	    if(estaElProducto.id == respuesta["id"]) { 
        	          	        console.log(true)
        	          	        
        	          	    } else { 
        	          	        console.log(false)
        	          	        
        	          	    } 
        	          	    
        	          	});
        	          	*/

	      				precioVta = respuesta[tipoPrecio];
	      				var precioXCantidad = precioVta * cantidad;
	      				precioNeto = precioVta / ((iva / 100) + 1); //precio neto para cantidad 1
	      				ivaValor = (precioNeto * iva / 100); // * cantidad;

	      				
	      			    cargarProductoSegunVista = '<div class="row" style="padding-left:25px;padding-bottom:5px;">'+

						 '<!-- Cantidad del producto -->'+
				          '<div class="col-xs-2 nuevaCantidad">'+
				             '<input type="text" autocomplete="off" style="text-align:center;" class="form-control input-sm nuevaCantidadProductoCaja" stock="'+stock+'" nuevoStock="'+Number(stock-1)+'" min="0" value="'+cantidad+'"  required>'+
				          '</div>'+
						  
						  '<!-- Descripción del producto -->'+				          
				          '<div class="col-xs-6" style="padding-right:0px">'+
				            '<div class="input-group">'+
				              '<span class="input-group-btn"><button type="button" class="btn btn-danger btn-sm quitarProductoCaja" idProducto="'+respuesta['id']+'"><i class="fa fa-times"></i></button></span>'+
				              '<input type="text" class="form-control input-sm nuevaDescripcionProductoCaja" idProducto="'+respuesta['id']+'"  value="'+respuesta['descripcion']+'" readonly>'+
							  '<input type="hidden" class="nuevaCategoria" value="'+respuesta["id_categoria"]+'">'+
				            '</div>'+
				          '</div>'+

						  '<!-- precio unitario del producto -->'+
				          '<div class="col-xs-2 nuevoPrecio">'+
					            '<div class="input-group">'+
								 '<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+
					             '<input type="text" style="text-align:center;" class="form-control input-sm nuevaPrecioUnitario" value="'+precioVta+'" readonly>'+
				            	'</div>'+
							'</div>'+
							 
				          '<!-- Precio total del producto -->'+
				          '<div class="col-xs-2 ingresoPrecio" style="padding-left:0px">'+
				            '<div class="input-group">'+
				              '<span class="input-group-addon"><i class="ion ion-social-usd"></i></span>'+
			  				  '<input type="hidden" class="nuevoTipoIvaValorProducto" value="'+ivaValor+'" netoUnitario="'+precioNeto+'" tipoIva="'+iva+'" cantxIva="'+cantidad+'" readonly required>'+
							  '<input type="hidden" class="nuevoValorTipoIva" value="'+iva+'" readonly required>'+
				              '<input type="text" class="form-control input-sm nuevoPrecioProductoCaja" precioReal="'+precioVta+'" precioCompra="'+respuesta["precio_compra"]+'" style="text-align:center;" value="'+precioXCantidad+'" required readonly>'+
				            '</div>'+
				          '</div>'+

				        '</div>';
				        
				         if(mobileDevice) {
                            
                           cargarProductoSegunVista = '<div class="row" style="padding-left:25px;padding-bottom:5px;">'+

        						 '<!-- Cantidad del producto -->'+
        				          '<div class="col-xs-2 nuevaCantidad">'+
        				             '<input type="text" autocomplete="off" style="text-align:center;" class="form-control input-sm nuevaCantidadProductoCaja" stock="'+stock+'" nuevoStock="'+Number(stock-1)+'" min="0" value="'+cantidad+'"  readonly>'+
        				          '</div>'+
        						  
        						  '<!-- Descripción del producto -->'+				          
        				          '<div class="col-xs-6" >'+
        				            '<div class="input-group">'+
        				              '<span class="input-group-btn"><button type="button" class="btn btn-danger btn-sm quitarProductoCaja" idProducto="'+respuesta['id']+'"><i class="fa fa-times"></i></button></span>'+
        				              '<input type="text" class="form-control input-sm nuevaDescripcionProductoCaja" idProducto="'+respuesta['id']+'" name="agregarProductoCaja" value="'+respuesta['descripcion']+'" readonly>'+
        							  '<input type="hidden" class="nuevaCategoria" value="'+respuesta["id_categoria"]+'">'+
        				            '</div>'+
        				          '</div>'+
        
        						  '<!-- precio unitario del producto -->'+
        				          '<div class="col-xs-2 nuevoPrecio" style="display: none">'+
        					             '<input type="text" style="text-align:center;" class="form-control input-sm nuevaPrecioUnitario" name="nuevaPrecioUnitario" value="'+precioVta+'" readonly>'+
        							'</div>'+
        							 
        				          '<!-- Precio total del producto -->'+
        				          '<div class="col-xs-4 ingresoPrecio" >'+
        				            
        			  				  '<input type="hidden" class="nuevoTipoIvaValorProducto" value="'+ivaValor+'" netoUnitario="'+precioNeto+'" tipoIva="'+iva+'" cantxIva="'+cantidad+'" readonly required>'+
        							  '<input type="hidden" class="nuevoValorTipoIva" value="'+iva+'" readonly required>'+
        				              '<input type="text" class="form-control input-sm nuevoPrecioProductoCaja" precioReal="'+precioVta+'" precioCompra="'+respuesta["precio_compra"]+'" style="text-align:center;" value="'+precioXCantidad+'" required readonly>'+
        				            
        				          '</div>'+
        
        				        '</div>';

                        }

	      				$(".nuevoProductoCaja").prepend( cargarProductoSegunVista );

				        sumarTotalPreciosCaja();

						//CALCULAR SI HAY DESCUENTO
				        calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

				        //CALCULAR SI HAY INTERES
				        calcularInteresCaja("nuevoInteresPorcentajeCaja");

				        // PONER FORMATO AL PRECIO DE LOS PRODUCTOS
						listarProductosCaja();

						//RESETEO METODO DE PAGO
		        		$("#nuevoMetodoPagoCaja").prop("selectedIndex", 0).change();

				        $(".nuevoPrecioProductoCaja").number(true, 2);

						localStorage.removeItem("quitarProductoCaja");

						$("#ventaCajaDetalleHidden").val("");
						$("#ventaCajaDetalle").val("");
						$("#autocompletarProducto").val("");
						$("#ventaCajaCantidad").val("1");
						$("#ventaCajaDetalle").focus();

	      			}

				} else {

					swal({
				      title: "Ventas",
				      text: "No se encontró el producto",
					  type: "warning",
					  toast: true,
					  position: 'top',
					  showConfirmButton: false,
					  timer: 3000
					});
					
					var audio = new Audio('vistas/dist/sound/alarm.mp3');
                    audio.play();

					$("#nuevoCodigoCaja").val(idProducto);

					$("#modalAgregarProductoCaja").modal('show');
					
					$('#modalAgregarProductoCaja').on('shown.bs.modal', function () {
					    $("#nuevaDescripcionCaja").focus();
					})  

				}
			} 

 		});

	}

}


$("#nuevoPrecioVentaIvaIncluidoCaja").keyup(function(){

	calcularPrecioVentaProductoCaja();

});

$("#nuevoIvaVentaCaja").change(function(){
	
	calcularPrecioVentaProductoCaja();	

});

function calcularPrecioVentaProductoCaja(){

	var precioVenta = Number($("#nuevoPrecioVentaIvaIncluidoCaja").val());
	var tipoIva = Number($("#nuevoIvaVentaCaja").val());

	var neto = precioVenta / (1 + (tipoIva / 100));

	$("#nuevoPrecioVentaCaja").val(redondear(neto,2));

}


$("#btnGuardarNuevoProductoCaja").click(function(){

	var datos = new FormData();
	datos.append("productoVentaCaja", 1);
	datos.append("codigo", $("#nuevoCodigoCaja").val());
	datos.append("descripcion", $("#nuevaDescripcionCaja").val());
	datos.append("tipo_iva", $("#nuevoIvaVentaCaja").val());
	datos.append("precio_venta", $("#nuevoPrecioVentaIvaIncluidoCaja").val());

	$.ajax({

		url:"ajax/productos.ajax.php",
		method: "POST",
		data: datos,
		cache: false,
		contentType: false,
		processData: false,
		dataType:"json",
		success:function(respuesta){

			if(respuesta== "ok"){

				$("#modalAgregarProductoCaja").modal('hide');
				$("#modalAgregarProductoCaja").find("input,textarea,select").val("");
				agregarProductoListaCompra();

			} else {

				console.log(respuesta);
				swal({
			      title: "Ventas",
			      text: "Error en base de datos",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});
			}

		},

		error: function(xhr, status, error) {
		  
			console.log( xhr.responseText);

			swal({
			      title: "Ventas",
			      text: "Error (500 - descripcion en consola)",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});
		}
    });



});

//AL CAMBIAR LOS INPUT DEL ARTICULO LIBRE
$(".nuevoProductoCaja").on("change", "input.nuevoPrecioProductoCaja", function(){ 

	sumarTotalPreciosCaja();

	//CALCULAR SI HAY DESCUENTO
    calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

    //CALCULAR SI HAY INTERES
    calcularInteresCaja("nuevoInteresPorcentajeCaja");

    // AGRUPAR PRODUCTOS EN FORMATO JSON
	listarProductosCaja();

})


function stopRKey(evt) {

	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	
	if ((evt.keyCode == 13) ) {

		return false;
	}

}

//document.onkeydown = stopRKey;

function datosCliente(valor){
	
	var datos = new FormData();
    datos.append("idCliente", valor);

	  $.ajax({

     	url:"ajax/productos.ajax.php",
      	method: "POST",
      	data: datos,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){
      	    
      	$(".nuevoDatosClienteCaja").append(

          	  '<div class="col-xs-4" style="padding-right:0px">'+
	          
	            '<div class="input-group">'+
	              
	                '<input type="text" class="form-control id="direccionCaja" name="direccionCaja" value="" readonly required>'+

	            '</div>'+

	          '</div>'+

	          '<div class="col-xs-4">'+
	            
	             '<input type="text" class="form-control id="telefonoCaja" name="telefonoCaja" value="" readonly required>'+
	          '</div>' 
				
			) 
		}
	});
}

$("#btnGuardarVentaCaja").click(function(e){

	e.preventDefault(); //Esta linea anula el submit para que no llame al controlador
	if($("#nuevoPrecioNetoCajaForm").val() != 0){ //si es cero no hace nada
	    
	    if(Number($("#seleccionarCliente").val()) != 1){
	        var datosClienteCtaCte = new FormData();
	        datosClienteCtaCte.append("idClienteCtaCte", Number($("#seleccionarCliente").val()));
	        
	        $.ajax({
             	url:"ajax/clientes_cta_cte.ajax.php",
              	method: "POST",
              	data: datosClienteCtaCte,
              	cache: false,
              	contentType: false,
              	processData: false,
              	dataType:"json",
              	success:function(respuesta){
                    $("#datosCuentaCorrienteCliente").html('<a href="index.php?ruta=clientes_cuenta&id_cliente='+$("#seleccionarCliente").val()+'" target="_blank"><i class="fa fa-book"></i></a>  ' + $("#autocompletarClienteCaja").val() + '<br>Estado Cta Cte: <b>$ ' + respuesta["saldo"] + '</b>');
              	},
        		error: function(xhr, status, error) {
        		  
        			console.log( xhr.responseText);
        			console.log( xhr);
        			console.log( status);
        			console.log( error);
        
        			swal({
        			      title: "Ventas",
        			      text: "Error (500 - descripcion en consola)",
        			      type: "error",
        				  toast: true,
        				  position: 'top',
        				  showConfirmButton: false,
        				  timer: 3000
        				});
        		  
        		}
            });
	    }
	
	
		$("#modalCobrarVenta").modal({
			backdrop: 'static',
			keyboard: false
		});
		$("#modalCobrarVenta").modal('show');
		$("#nuevoMetodoPagoCaja").val("Efectivo").change(); //Por defecto selecciona Efectivo
		$("#nuevoValorEntrega").val($("#nuevoTotalVentaCaja").val());
	} else {
	    swal({
	      title: "Ventas",
	      text: "Importe es igual a cero",
	      type: "error",
		  toast: true,
		  position: 'top',
		  showConfirmButton: false,
		  timer: 3000
		});
		return;
	}

});

function PadLeft(value, length) {
    return (value.toString().length < length) ? PadLeft("0" + value, length) : 
    value;
}

// BOTON GUARDAR VENTA
$("#btnCobrarMedioPagoCaja").click(function(e){
	if(Number($("#nuevoValorSaldo").text()) != 0){
		swal({
	      title: "Ventas",
	      text: "La suma de las entregas debe cancelar el saldo",
	      type: "error",
		  toast: true,
		  position: 'top',
		  showConfirmButton: false,
		  timer: 3000
		});
		$("#btnCobrarMedioPagoCaja").removeAttr('disabled');
		return;	
	}

	var datosVentaCaja = new FormData();
	datosVentaCaja.append("fechaActual", $("#fechaActual").val());
	datosVentaCaja.append("idVendedor", $("#idVendedor").val());
	datosVentaCaja.append("sucursalVendedor", $("#sucursalVendedor").val());
	datosVentaCaja.append("nombreVendedor", $("#nuevoVendedor").val());
	datosVentaCaja.append("seleccionarCliente", $("#seleccionarCliente").val());
	datosVentaCaja.append("nuevaVentaCaja", $("#nuevaVentaCaja").val()); //???
	datosVentaCaja.append("listaProductosCaja", $("#listaProductosCaja").val());
	datosVentaCaja.append("nuevoPrecioImpuestoCaja", $("#nuevoPrecioImpuestoCaja").val());

	// datosVentaCaja.append("nuevoVtaCajaIva0", $("#nuevoVtaCajaIva0").val());
	datosVentaCaja.append("nuevoVtaCajaIva2", $("#nuevoVtaCajaIva2").val());
	datosVentaCaja.append("nuevoVtaCajaIva5", $("#nuevoVtaCajaIva5").val());
	datosVentaCaja.append("nuevoVtaCajaIva10", $("#nuevoVtaCajaIva10").val());
	datosVentaCaja.append("nuevoVtaCajaIva21", $("#nuevoVtaCajaIva21").val());
	datosVentaCaja.append("nuevoVtaCajaIva27", $("#nuevoVtaCajaIva27").val());

	datosVentaCaja.append("nuevoVtaCajaBaseImp0", $("#nuevoVtaCajaBaseImp0").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp2", $("#nuevoVtaCajaBaseImp2").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp5", $("#nuevoVtaCajaBaseImp5").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp10", $("#nuevoVtaCajaBaseImp10").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp21", $("#nuevoVtaCajaBaseImp21").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp27", $("#nuevoVtaCajaBaseImp27").val());

	datosVentaCaja.append("nuevoPrecioNetoCaja", $("#nuevoPrecioNetoCaja").val());
	datosVentaCaja.append("nuevoTotalVentaCaja", $("#nuevoTotalVentaCaja").val());
	datosVentaCaja.append("listaMetodoPagoCaja", $("#listaMetodoPagoCaja").val());
	datosVentaCaja.append("mxMediosPagos", $("#mxMediosPagos").val());
	datosVentaCaja.append("nuevoInteresPorcentajeCaja", $("#nuevoInteresPorcentajeCaja").val());
	datosVentaCaja.append("nuevoDescuentoPorcentajeCaja", $("#nuevoDescuentoPorcentajeCaja").val());
	
	datosVentaCaja.append("nuevotipoCbte", $("#nuevotipoCbte").val());
	datosVentaCaja.append("nuevaPtoVta", $("#nuevaPtoVta").val());
	datosVentaCaja.append("nuevaConcepto", $("#nuevaConcepto").val());
	datosVentaCaja.append("nuevaFecDesde", $("#nuevaFecDesde").val());
	datosVentaCaja.append("nuevaFecHasta", $("#nuevaFecHasta").val());
	datosVentaCaja.append("nuevaFecVto", $("#nuevaFecVto").val());

	datosVentaCaja.append("nuevotipoCbteAsociado", $("#nuevotipoCbteAsociado").val());
	datosVentaCaja.append("nuevaPtoVtaAsociado", $("#nuevaPtoVtaAsociado").val());
	datosVentaCaja.append("nuevaNroCbteAsociado", $("#nuevaNroCbteAsociado").val());

	datosVentaCaja.append("tokenIdTablaVentas", $("#tokenIdTablaVentas").val());

  	$.ajax({

     	url:"ajax/ventas.ajax.php",
      	method: "POST",
      	data: datosVentaCaja,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){
      		console.log(respuesta);
      		var mesajes = "";
      		if(respuesta['estado'] == "ok") {
      			swal({
			      title: "Ventas",
			      text: "Venta guardada correctamente",
			      type: "success",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});;

	      		$("#modalCobrarVenta").modal('hide');
	      		var jsonProductos = JSON.parse($("#listaProductosCaja").val());
	      		var subto = 0;
	            for(var i = 0; i < jsonProductos.length; i++){
	            	subto = subto + Number(jsonProductos[i]["total"]);
                    $("#tckDetalleVentaCaja").append("<tr><td><center>"+jsonProductos[i]["cantidad"]+" * $" + redondear(jsonProductos[i]["precio"],2) +  "</center></td><td><center>"+jsonProductos[i]["descripcion"]+"</center></td><td><center>$ "+redondear(jsonProductos[i]["total"],2)+"</center></td></tr>")
                }
                $("#tckControlCbte").text($("#nuevaVentaCaja").val());
                $("#tckDatosFacturaFecha").text('FECHA: ' + $("#fechaActual").val());
                var campoCliente = $("#autocompletarClienteCaja").val();
                if(campoCliente == '') {
                	$("#tckDatosFacturaNombreCliente").text("1-Consumidor Final");
                } else {
                	$("#tckDatosFacturaNombreCliente").text($("#autocompletarClienteCaja").val());	
                }
				$("#tckSubtotalVentaCaja").text(redondear(subto,2));
				if (Number($("#nuevoDescuentoPrecioCaja").val()) != 0) {
                 	var tckDto = Number($("#nuevoDescuentoPrecioCaja").val());
                 	if(tckDto < 0) $("#campoDtoTexto").text('Recargo');
                 	tckDto = Math.abs(tckDto);
                 	$("#tckDescuentoVentaCaja").text(redondear(tckDto,2));
                 	
                } else {
                 	$("#tckDescuentoVentaCaja").text('0,00');
                }
                
                /*
                var tipoMedioElegido = $("#listaMetodoPagoCaja").val();
                tipoMedioElegido = tipoMedioElegido.split('-');
                switch(tipoMedioElegido[0]){
                    case "TD": tckMedio = "Tarjeta Débito "  + tipoMedioElegido[1]; 
                        break;
                    case "TC": tckMedio = "Tarjeta Crédito " + tipoMedioElegido[1]; 
                        break;
                    case "TR": tckMedio = "Transferencia"; 
                        break;
                    case "CC": tckMedio = "Cuenta Corriente"; 
                        break;
                    case "CH": tckMedio = "Cheque";
                        break;
                    default: tckMedio = "Efectivo";
                        break;
                }
                $("#tckMedioPagoVentaCaja").text(tckMedio);
                */
                var tipoMedioElegido =  ($("#mxMediosPagos").val() == "") ? [{"tipo":$("#listaMetodoPagoCaja").val(),"entrega":$("#nuevoTotalVentaCaja").val()}] : JSON.parse($("#mxMediosPagos").val());
                console.log(tipoMedioElegido)
                var medioEvaluado = "";
                var tckMedio = "<ul>";
                for(let rec = 0; rec < tipoMedioElegido.length; rec++) {
                    console.log(tipoMedioElegido[rec]);
                    medioEvaluado = tipoMedioElegido[rec]["tipo"].split('-');
                    console.log(medioEvaluado[0])
                    switch(medioEvaluado[0]){
                        case "TD": tckMedio += "<li>Tarjeta Débito "  + medioEvaluado[1] + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        case "MP": tckMedio += "<li>Mercado Pago "  + medioEvaluado[1] + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        case "TC": tckMedio += "<li>Tarjeta Crédito " + medioEvaluado[1] + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        case "TR": tckMedio += "<li>Transferencia" + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        case "CC": tckMedio += "<li>Cuenta Corriente" + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        case "CH": tckMedio += "<li>Cheque" + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                        default: tckMedio += "<li>Efectivo" + " ( $ " + tipoMedioElegido[rec]["entrega"] + ")</li>"; break;
                    }
                }

                tckMedio += "</ul>";
                $("#tckMedioPagoVentaCaja").html(tckMedio);

                $("#tckTotalVentaCaja").text($("#nuevoTotalVentaCaja").val());

                var letraCbte = ($("#nuevotipoCbte").val() == "999") ? "Devolucion" : "X";
                var ptoVta = Number($("#nuevaPtoVta").val()); //respuesta["factura"]["pto_vta"];
                
                //DATOS FACTURACION
                if (respuesta["factura"]["cae"]) {
                	$("#tckDatosFacturaEmisorReceptor").css('display', '');
                	$("#tckDatosFacturaCAE").css('display', '');

                	if($("#nuevotipoCbte").val() == "1" || $("#nuevotipoCbte").val() == "2" || $("#nuevotipoCbte").val() == "3" || $("#nuevotipoCbte").val() == "4") {
                		letraCbte = "A";
                		$("#tckDetalleFacturaA").append(
            				'<span>Subtotal: $' +respuesta["factura"]["neto_gravado"]+
							'</span><br>'); 
                		var facDet = JSON.parse(respuesta["factura"]["impuesto_detalle"]);
                		for (var i = 0; i < facDet.length; i++) {
                			if(facDet[i].id != 3) {
                    			$("#tckDetalleFacturaA").append(
                    				'<span>' +
                    					facDet[i].descripcion + ' : $' + facDet[i].iva +
                    				'</span><br>'
                				);
                			}
                		}
                	} else if($("#nuevotipoCbte").val() == "6" || $("#nuevotipoCbte").val() == "7" || $("#nuevotipoCbte").val() == "8" || $("#nuevotipoCbte").val() == "9") {
                		letraCbte = "B";
                		$("#tckDetalleFacturaA").append('<span>IVA contenido (Ley 27.743): $ '+respuesta["factura"]["impuesto"]+'</span>');

                	} else if($("#nuevotipoCbte").val() == "11" || $("#nuevotipoCbte").val() == "12" || $("#nuevotipoCbte").val() == "13" || $("#nuevotipoCbte").val() == "15") {
                		letraCbte = "C";
                	} else if($("#nuevotipoCbte").val() == "201" || $("#nuevotipoCbte").val() == "202" || $("#nuevotipoCbte").val() == "203") {
                		letraCbte = "FCE - A"; //factura de credito electronica miPyme
                		$("#tckDetalleFacturaA").append(
            				'<span>Subtotal: $' +respuesta["factura"]["neto_gravado"]+
							'</span><br>'); 
                		var facDet = JSON.parse(respuesta["factura"]["impuesto_detalle"]);

                		for (var i = 0; i < facDet.length; i++) {

                			if(facDet[i].id != 3) {
                    			$("#tckDetalleFacturaA").append(
                    				'<span>' +
                    					facDet[i].descripcion + ' : $' + facDet[i].iva +
                    				'</span><br>'
                				);
                			}
                		}

                	} else if($("#nuevotipoCbte").val() == "206" || $("#nuevotipoCbte").val() == "207" || $("#nuevotipoCbte").val() == "208") {
                		letraCbte = "FCE - B"; //factura de credito electronica miPyme

                	} else if($("#nuevotipoCbte").val() == "211" || $("#nuevotipoCbte").val() == "212" || $("#nuevotipoCbte").val() == "213") {
                		letraCbte = "FCE - C"; //factura de credito electronica miPyme

                	} else {
                		letraCbte = "";

                	}
                	
                	var letraTipoCbte = "";
					switch($("#nuevotipoCbte").val()){
			      			case "1": 
			      			case "6": 
			      			case "11":
			      			case "201":
			      			case "206":
			      			case "211": 
			      				letraTipoCbte = "Factura ";
			      				break;
			      			case "2": 
			      			case "7": 
			      			case "12":
			      			case "202":
			      			case "207":
			      			case "212": 
			      				letraTipoCbte = "Nota débito ";
			      				break;
			      			case "3": 
			      			case "8": 
			      			case "13":
			      			case "203":
			      			case "208":
			      			case "213": 
			      				letraTipoCbte = "Nota crédito ";
			      				break;
			      			case "4": 
			      			case "9": 
			      			case "15":
			      				letraTipoCbte = "Recibo ";
			      				break;

			      	}

			      	letraCbte = letraTipoCbte + letraCbte;
                	var numfac = respuesta["factura"]["nro_cbte"];

                    //$("#tckDatosFacturaPtoNum").text();
	                $("#tckDatosFacturaNumCbte").text('N°: ' + PadLeft(ptoVta,5) + '-' + PadLeft(numfac,8));
	                //$("#tckDatosFacturaTipoDoc").text();
	                //$("#tckDatosFacturaNumDoc").text();
	                
	                //$("#tckDatosFacturaCondIva").text();
	                $("#tckDatosFacturaNumCAE").text('CAE: ' + respuesta["factura"]["cae"]);
	                $("#tckDatosFacturaVtoCAE").text('Vto. CAE: ' + respuesta["factura"]["fec_vto_cae"]);

					//IMPRIMO CODIGO QR
					var arregloFactura = respuesta["datosFacturacion"]["FeCAEReq"]["FeDetReq"]["FECAEDetRequest"];
					var fechaQR = $("#fechaActual").val();
					fechaQR = fechaQR.split(" ");
					var jsonQR = '{"ver":1,"fecha":"'+fechaQR[0]+'","cuit":'+Number($("#cuitEmpresaEmisora").text())+',"ptoVta":'+ptoVta+',"tipoCmp":'+Number($("#nuevotipoCbte").val())+',"nroCmp":'+numfac+',"importe":'+Number($("#nuevoTotalVentaCaja").val())+',"moneda":"PES","ctz":1,"tipoDocRec":'+arregloFactura["DocTipo"]+',"nroDocRec":'+arregloFactura["DocNro"]+',"tipoCodAut":"E","codAut":'+respuesta["factura"]["cae"]+'}';
					var urlAFIPQR = 'https://www.afip.gob.ar/fe/qr/?p=' + btoa(jsonQR);
					var qrcodePLG = new QRCode(document.getElementById("dibujoCodigoQR"), {
						width : 150,
						height : 150
					});

					qrcodePLG.makeCode(urlAFIPQR);

                } else {
                	$("#tckDatosFacturaEmisorReceptor").css('display', 'none');
                	$("#tckDatosFacturaCAE").css('display', 'none');
                	$("#tckDatosFacturaNumCbte").text('N°: ' + PadLeft(ptoVta,5) + '-' + PadLeft(respuesta["codigoVta"],8));
                }

                $("#tckDatosFacturaTipoCbte").text(letraCbte);
	      		//Configuro al modal para que no se pueda hacer click afuera. 
	      		//Necesariamente el usuario debe presionar "cerrar" para recargar la pagina o "imprimir" el ticket

	      		$("#modalImprimirTicketCaja").modal({
	      			backdrop: 'static',
					keyboard: false
	      		});

				$("#btnImprimirA4Control").attr('codigoVta', respuesta["codigoVta"]);

				$("#btnEnviarMailA4").attr('codigoVta', respuesta["codigoVta"]);

	      		$("#modalImprimirTicketCaja").modal("show");

	      		//si hay eevento u observaciones y la factura se aprobó igual lo muestro aca:
				if (respuesta.hasOwnProperty('msjAfip')) {
					if(respuesta['msjAfip'] !== null){
						mesajes = 'Advertencia AFIP: ' + JSON.stringify(respuesta['msjAfip']);
						$("#divEventoObservacionAprobada").css('background-color', '#f39c12');
						$("#divEventoObservacionAprobada").append('<i class="fa fa-exclamation-triangle"></i> ' + mesajes);
					}
				}

      		} else {

      			swal({
			      title: "Ventas",
			      text: "Error al procesar la venta",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});

				$("#btnCobrarMedioPagoCajaFac").removeAttr('disabled');

				// if(respuesta['factura']['observaciones'] != ""){
				// 	$("#divVisualizarObservacionesFactura").css('display', '');
				//  $("#impTicketCobroCajaObservacionFact").text( respuesta['factura']['observaciones']);
				// }

				$("#divVisualizarObservacionesFactura").css('display', '');

				//if ('observaciones' in respuesta['factura']) {
				if (respuesta.hasOwnProperty('modeloVentas')) {
					mesajes = 'Error: ' + respuesta['modeloVentas'];
				}

				if(respuesta.hasOwnProperty('factura')){
					if (respuesta['factura'].hasOwnProperty('observaciones')) {
						mesajes = 'Observaciones: ' + respuesta['factura']['observaciones'];
					}

					// if ('errores' in respuesta['factura']) {
					if (respuesta['factura'].hasOwnProperty('errores')) {
						mesajes = mesajes + ' Errores: ' + respuesta['factura']['errores'];	
					} 

					// if ('eventos' in respuesta['factura']) {
					if (respuesta['factura'].hasOwnProperty('eventos')) {	
						mesajes = mesajes + ' Eventos: ' + respuesta['factura']['eventos'];
					}
				}

				$("#impTicketCobroCajaObservacionFact").text(mesajes);

      		}
      	},

		error: function(xhr, status, error) {
		  
			console.log( xhr.responseText);
			console.log( xhr);
			console.log( status);
			console.log( error);

			swal({
			      title: "Ventas",
			      text: "Error (500 - descripcion en consola)",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});
		  // var err = eval("(" + xhr.responseText + ")");
		  // console.log(err.Message);
		}
    });

});

// BOTON GUARDAR PRESUPUESTO
$("#btnGuardarPresupuestoCaja").click(function(e){

	var datosVentaCaja = new FormData();

	datosVentaCaja.append("fechaActual", $("#fechaActual").val());
	datosVentaCaja.append("idVendedor", $("#idVendedor").val());
	datosVentaCaja.append("seleccionarCliente", $("#seleccionarCliente").val());
	datosVentaCaja.append("nuevoPresupuestoCaja", $("#nuevaVentaCaja").val()); //???
	datosVentaCaja.append("listaProductosCaja", $("#listaProductosCaja").val());
	datosVentaCaja.append("nuevoPrecioImpuestoCaja", $("#nuevoPrecioImpuestoCaja").val());

	// datosVentaCaja.append("nuevoVtaCajaIva0", $("#nuevoVtaCajaIva0").val());
	datosVentaCaja.append("nuevoVtaCajaIva2", $("#nuevoVtaCajaIva2").val());
	datosVentaCaja.append("nuevoVtaCajaIva5", $("#nuevoVtaCajaIva5").val());
	datosVentaCaja.append("nuevoVtaCajaIva10", $("#nuevoVtaCajaIva10").val());
	datosVentaCaja.append("nuevoVtaCajaIva21", $("#nuevoVtaCajaIva21").val());
	datosVentaCaja.append("nuevoVtaCajaIva27", $("#nuevoVtaCajaIva27").val());

	datosVentaCaja.append("nuevoVtaCajaBaseImp0", $("#nuevoVtaCajaBaseImp0").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp2", $("#nuevoVtaCajaBaseImp2").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp5", $("#nuevoVtaCajaBaseImp5").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp10", $("#nuevoVtaCajaBaseImp10").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp21", $("#nuevoVtaCajaBaseImp21").val());
	datosVentaCaja.append("nuevoVtaCajaBaseImp27", $("#nuevoVtaCajaBaseImp27").val());

	datosVentaCaja.append("nuevoPrecioNetoCaja", $("#nuevoPrecioNetoCaja").val());
	datosVentaCaja.append("nuevoTotalVentaCaja", $("#nuevoTotalVentaCaja").val());
	datosVentaCaja.append("listaMetodoPagoCaja", $("#listaMetodoPagoCaja").val());
	datosVentaCaja.append("nuevoInteresPorcentajeCaja", $("#nuevoInteresPorcentajeCaja").val());
	datosVentaCaja.append("nuevoDescuentoPorcentajeCaja", $("#nuevoDescuentoPorcentajeCaja").val());
		
	datosVentaCaja.append("nuevotipoCbte", $("#nuevotipoCbte").val());
	datosVentaCaja.append("nuevaPtoVta", $("#nuevaPtoVta").val());
	datosVentaCaja.append("nuevaConcepto", $("#nuevaConcepto").val());
	datosVentaCaja.append("nuevaFecDesde", $("#nuevaFecDesde").val());
	datosVentaCaja.append("nuevaFecHasta", $("#nuevaFecHasta").val());
	datosVentaCaja.append("nuevaFecVto", $("#nuevaFecVto").val());

  	$.ajax({

     	url:"ajax/presupuestos.ajax.php",
      	method: "POST",
      	data: datosVentaCaja,
      	cache: false,
      	contentType: false,
      	processData: false,
      	dataType:"json",
      	success:function(respuesta){

      		console.log(respuesta);

      		if(respuesta['estado'] == "ok") {

      			swal({
			      title: "Presupuestos",
			      text: "Presupuesto guardado correctamente",
			      type: "success",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});;

	      		$("#modalCobrarVenta").modal('hide');

	      		var jsonProductos = JSON.parse($("#listaProductosCaja").val());

	            for(var i = 0; i < jsonProductos.length; i++){

                    $("#tckDetalleVentaCaja").append("<tr><td><center>"+jsonProductos[i]["cantidad"]+"</center></td><td>"+jsonProductos[i]["descripcion"]+"</td><td><center>$ "+redondear(jsonProductos[i]["total"],2)+"</center></td></tr>")

                }
				

                $("#tckControlCbte").text($("#nuevaVentaCaja").val());

                $("#tckDatosFacturaFecha").text('FECHA: ' + $("#fechaActual").val());
                $("#tckDatosFacturaNombreCliente").text($("#autocompletarClienteCaja").val());

                $("#tckMedioPagoVentaCaja").text($("#listaMetodoPagoCaja").val());

                $("#tckTotalVentaCaja").text($("#nuevoTotalVentaCaja").val());

                var letraCbte = "X";

            	$("#tckDatosFacturaTipoCbte").text(letraCbte);

            	$("#tckDatosFacturaEmisorReceptor").css('display', 'none');
            	$("#tckDatosFacturaCAE").css('display', 'none');


	      		//Configuro al modal para que no se pueda hacer click afuera. 
	      		//Necesariamente el usuario debe presionar "cerrar" para recargar la pagina o "imprimir" el ticket

	      		$("#modalImprimirTicketCaja").modal({
	      			backdrop: 'static',
					keyboard: false
	      		});

	      		$("#modalImprimirTicketCaja").modal("show");

      		} else {

      			swal({
			      title: "Ventas",
			      text: "Error al procesar la venta",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});

				$("#btnCobrarMedioPagoCajaFac").removeAttr('disabled');
				var mesajes = "";
				$("#divVisualizarObservacionesFactura").css('display', '');

				// if (respuesta['factura'].hasOwnProperty('observaciones')) {
				// 	mesajes = 'Observaciones: ' + respuesta['factura']['observaciones'];
				// }

				// if (respuesta['factura'].hasOwnProperty('errores')) {
				// 	mesajes = mesajes + ' Errores: ' + respuesta['factura']['errores'];	
				// } 

				// if (respuesta['factura'].hasOwnProperty('eventos')) {	
				// 	mesajes = mesajes + ' Eventos: ' + respuesta['factura']['eventos'];
				// }

				$("#impTicketCobroCajaObservacionFact").text(mesajes);

      		}
      	},

		error: function(xhr, status, error) {
		  
			console.log( xhr.responseText);
			console.log( xhr);
			console.log( status);
			console.log( error);

			swal({
			      title: "Presupuestos",
			      text: "Error (500 - descripcion en consola)",
			      type: "error",
				  toast: true,
				  position: 'top',
				  showConfirmButton: false,
				  timer: 3000
				});
		}

    });

});

$("#btnSalirMedioPagoCaja").click(function(){
	
	$("#btnCobrarMedioPagoCaja").removeAttr('disabled');
	// $("#listaDescuentoCaja").val('');
	// $(".nuevoProductoCaja").empty();
	$("div.nuevoProductoCaja .descuentoPorTipoCliente").remove();

});

$("#btnImprimirTicketControl").click(function(){

  //PrintElem("impTicketCobroCaja");
  impTicketCaja("impTicketCobroCaja");

});

//Esta funcion es para imprimir pero requerie actualizar al final para recargar la pagina
// function PrintElem(el) {
//   var restorepage = $('body').html();
//   var printcontent = $('#' + el).clone();
//   $('body').empty().html(printcontent);
//   window.print();
//   location.reload();
// }

function impTicketCaja(el){

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write('<html><head>');
	mywindow.document.write('<style>'+
		'.tabla{' +
			'width:100%;' +
			'border-collapse:collapse;' +
			'margin:16px 0 16px 0;}' +
		'.tabla th{'+
			'border:1px solid #ddd;'+
			'padding:4px;'+
			'background-color:#d4eefd;'+
			'text-align:left;'+
			'font-size:20px;}'+
		'.tabla td{'+
			'border:1px solid #ddd;'+
			'text-align:left;'+
			'padding:6px;}'+

			'</style>');
    mywindow.document.write('</head><body style="font-family: Arial; font-size: 20px">');
    mywindow.document.write(document.getElementById(el).innerHTML);
    mywindow.document.write('</body></html>');
    // mywindow.document.close(); // necesario para IE >= 10
    // mywindow.focus(); // necesario para IE >= 10

    mywindow.print();
    mywindow.close();
    return true;
}

$("#btnSalirTicketControl").click(function(){

	var pathname = window.location.href;
    if (pathname.includes('crear-venta-caja')) { 
    	window.location = 'crear-venta-caja';
    } else {
        window.location = 'crear-venta';
    }

});

$("#btnSalirTicketPresupuesto").click(function(){

	window.location = 'crear-presupuesto-caja';

});

/*=============================================
AUTOCOMPLETAR CLIENTES (VENTAS.PHP)
=============================================*/
$( "#autocompletarClienteCaja" ).autocomplete({
  source: function( request, response ) {
    $.ajax({
      url:"ajax/clientes.ajax.php",
      dataType: "json",
      data: {
        listadoCliente: request.term
      },
      success: function( data ) {
    	response( data );
      }, 
      error: function(e){
      	console.log(e.responseText)
      }
    });
  },
  minLength: 3,
  focus: function (event, ui) {
        event.preventDefault();
  },
  select: function( event, ui ) {
  	event.preventDefault();
	var idSeleccionado = ui.item.value.id;
	if(idSeleccionado[0]!=""){
		$(this).val(ui.item.value.nombre + ' - ' + ui.item.value.tipo_documento + ': ' + ui.item.value.documento );
		$("#seleccionarCliente").val(idSeleccionado);
		$("#autocompletarClienteCajaMail").val(ui.item.value.email);
	} 
   },
    change: function (event, ui) {
        if (ui.item === null) {
            $(this).val('');
            $('#seleccionarCliente').val(1);
            $("#autocompletarClienteCajaMail").val('');
        }
    }

});

function cargarCodigo(valor){

	document.getElementById("ventaCajaDetalle").value = valor;
}



function mostrarPrecio(){
	

 document.getElementById("descripcionConsultaPrecio").innerHTML = '';
 document.getElementById("consultaPrecioProducto").innerHTML='';
 document.getElementById("precioProducto").value='';
 //document.getElementById("slide").style.display="none";
 document.getElementById("consultarPrecio").style.display="block";
 document.getElementById("precioProducto").style.display="block";
}

function ocultarPrecio(){
	//document.getElementById("slide").style.display="block";
	document.getElementById("consultarPrecio").style.display="none";
	$("#ventaCajaDetalle").focus();
}

// $('.carousel').carousel();

/*=============================================
AUTOCOMPLETAR PRODUCTOS
=============================================*/
$( "#ventaCajaDetalle" ).autocomplete({
    source: function( request, response ) {
        $.ajax({
            url:"ajax/productos.ajax.php",
            dataType: "json",
            data: {
                listadoProd: request.term
            },
            success: function( data ) {
                response( data );
            }, 
            error: function(e){
                console.log(e.responseText)
            }
        });        
    },
    minLength: 3,
    focus: function (event, ui) {
        event.preventDefault();
    },
    select: function( event, ui ) {
        event.preventDefault();
        var idSeleccionado = ui.item.value.codigo;
        $("#ventaCajaDetalleHidden").val(idSeleccionado);
        $("#ventaCajaDetalle").val(idSeleccionado);
        
    }
});

/*=============================================
AGREGAR PRECIO
=============================================*/
$("#precioProducto").keyup( function (e) {
    if (e.keyCode == 13 ) {
    	agregarPrecioProducto();
	} 
	if (e.keyCode == 39) {
		document.getElementById('precioProducto').focus();
	}
});

function agregarPrecioProducto() {
	if($("#precioProductoHidden").val()!=""){
		var idProductoDos = $("#precioProductoHidden").val();
	} else {
		var idProductoDos = $("#precioProducto").val();
	}

	if(idProductoDos == "" || idProductoDos == undefined) {
		swal({
	      title: "Ventas",
	      text: "Error",
	      type: "error",
	      confirmButtonText: "¡Cerrar!"
		});
	} else {
		document.getElementById("precioProducto").style.display="none";
		var datos = new FormData();
	    datos.append("codigo", idProductoDos);
		var fechaActual = document.getElementById("fechaActual").value;
 		$.ajax({
	     	url:"ajax/productos.ajax.php",
	      	method: "POST",
	      	data: datos,
	      	cache: false,
	      	contentType: false,
	      	processData: false,
	      	dataType:"json",
	      	success:function(respuesta) {
	      		if(respuesta ){
					if(respuesta["estado"]==1) {

						if(respuesta["estadoPromocion"]==1) {

							var year = respuesta["fechaPromo"].substr(0, 4);
							var mes = respuesta["fechaPromo"].substr(5, 2);
							var dia = respuesta["fechaPromo"].substr(8, 2);
							var hora = respuesta["fechaPromo"].substr(11, 2);
							var minuto = respuesta["fechaPromo"].substr(14, 2);
							var segundo = respuesta["fechaPromo"].substr(17, 2);

							var year2 = fechaActual.substr(0, 4);
							var mes2 = fechaActual.substr(5, 2);
							var dia2 = fechaActual.substr(8, 2);
							var hora2 = fechaActual.substr(11, 2);
							var minuto2 = fechaActual.substr(14, 2);
							var segundo2 = fechaActual.substr(17, 2);

							var f1 = new Date(year, mes, dia, hora, minuto, segundo);
							var f2 = new Date(year2, mes2, dia2, hora2, minuto2, segundo2); 

							if(f1 > f2) {
								var precio = respuesta["precioPromo"];
							} else {
								var precio = respuesta["precio_venta"]; 
							}	
						} else {
							var precio = respuesta["precio_venta"]; 
						}	
					document.getElementById("descripcionConsultaPrecio").innerHTML = respuesta["descripcion"];
					document.getElementById("consultaPrecioProducto").innerHTML="$"+precio;
					setTimeout(function(){ocultarPrecio();},5000);
			       
				} else { //Cierre Else estado
					swal({
				      title: "Ventas",
				      text: "El producto Ingresado se encuetra deshabilitado",
				      type: "error",
					  toast: true,
					  position: 'top',
					  showConfirmButton: false,
					  timer: 3000
					});
				}
			} else{
					swal({
				      title: "Ventas",
				      text: "No se encontró el código de producto ingresado",
				      type: "error",
					  toast: true,
					  position: 'top',
					  showConfirmButton: false,
					  timer: 3000
					});
				}
			}
 		})
	}
}

function cargarProductosConsulta() {

 	var datos = new FormData();
    datos.append("listarProductos", true);

    $.ajax({

      url:"ajax/productos.ajax.php",
      method: "POST",
      data: datos,
      cache: false,
      contentType: false,
      processData: false,
      dataType:"json",
      success:function(respuesta){

	      lstNombres = [];
	      for(var i=0; i<=respuesta.length-1; i++){

	      	if(respuesta[i]["descripcion"] == "Producto Sin Registrar") {

	      		lstNombres.push(respuesta[i]["codigo"] + "-" + respuesta[i]["descripcion"]);

	      	} else {

	      		lstNombres.push(respuesta[i]["codigo"] + "-" +respuesta[i]["descripcion"]);

	      	}

	      }

	      $("#articuloConsulta" ).autocomplete({
		      source: lstNombres,
		      select: function(event, ui){
		      	var idSeleccionado = ui.item.value.split("-",1);
		      	$("#nombreHidden").val(idSeleccionado[0]);
		      		
		      }
		  });
		  
	  }

  	})
}

$("#btnImprimirTicketCierreCaja").click(function(){

	impTicketCaja("impTicketCierreCaja");

});

//boton para imprimir comprobante en A4
$("#btnImprimirA4Control").click(function(){

	var codigo = $(this).attr('codigoVta');

	window.open("comprobante/"+codigo, "_blank");

});

//boton para enviar cbte por mail
$("#btnEnviarMailA4").click(function(){

	var codigo = $(this).attr('codigoVta');
	var email = prompt('Introduzca dirección de e-mail', $("#autocompletarClienteCajaMail").val() );

	function validateEmail(email) {
	  var re = /\S+@\S+\.\S+/;
	  return re.test(email);
	}

	if(validateEmail(email)){
		window.open("extensiones/vendor/tecnickcom/tcpdf/pdf/comprobanteMail.php?codigo="+codigo+"&email="+email, "_blank");
	} else {
		alert("Dirección de e-mail inválida");
	}
	
});

/*=============================================
CAMBIO EN EFECTIVO
=============================================*/
function cambioCalculo(valor){
	valor = valor.replace(',', '.');
	var cambio =  Number(valor) - Number(document.getElementById("nuevoTotalVentaCaja").value);
	document.getElementById("cambio").value = redondear(cambio,2);
}

function redondear(cantidad,decimales) {

	var cantidad=parseFloat(cantidad);
	var decimales=parseFloat(decimales);
	decimales=(!decimales?2:decimales);

	return Math.round(cantidad*Math.pow(10,decimales))/Math.pow(10,decimales);
}

function agregarImpuestoCaja(){
	//no se usa esta funcion - REVISAR
}

/*=============================================
ATAJO DE TECLADO
=============================================*/
function atajoModalVentaCaja(e) {
    
    //console.log(e.keyCode)

    if (e.keyCode == 118) { // Atajo para abrir modal de Guardar Venta--->F7
        
        $("#btnGuardarVentaCaja").click();

    }
    
    if ($('#modalCobrarVenta').hasClass('in')===true && e.keyCode == 119){ //atajo para guardar venta F8

        $("#btnCobrarMedioPagoCaja").click();
    
    }
    
    if ($('#modalImprimirTicketCaja').hasClass('in')===true && e.keyCode == 120) {//atajo para imprimir ticket F9
    
        $("#btnImprimirTicketControl").click();
        window.location = 'crear-venta-caja';
    }

    if ($('#modalCobrarVenta').hasClass('in')===true && e.keyCode == 27) {//atajo para salir sin imprimir ticket
    
        $("#btnSalirMedioPagoCaja").click();
    }
    
    if ($('#modalImprimirTicketCaja').hasClass('in')===true && e.keyCode == 27) {//atajo para salir sin imprimir ticket
    
        window.location = 'crear-venta-caja';
    }
    
    if ($('#modalCobrarVenta').hasClass('in')===true && e.ctrlKey && e.keyCode == 77  ) { //CTRL + M cambio medios de pago
    
        var medios = $("#nuevoMetodoPagoCaja option").length;
        var indice = $("#nuevoMetodoPagoCaja").prop('selectedIndex');
        if( indice === (medios-1) ) { indice = 1;} else { indice++; }
        $("#nuevoMetodoPagoCaja").prop('selectedIndex', indice).change();
        
    }

}

// register the handler 
document.addEventListener('keyup', atajoModalVentaCaja, false);

$(".nuevoProductoCaja").on("keyup", "input.nuevaCantidadProductoCaja", function() {
	
	$(this).parent().parent().children(".ingresoPrecio").children().children(".nuevoTipoIvaValorProducto").attr('cantxiva', $(this).val());
	 
	var precio = $(this).parent().parent().children(".ingresoPrecio").children().children(".nuevoPrecioProductoCaja");
	
	var precioFinal = $(this).val() * precio.attr("precioReal");
	
	precio.val(precioFinal);
	var nuevoStock = Number($(this).attr("stock")) - $(this).val();

	$(this).attr("nuevoStock", nuevoStock);

	// SUMAR TOTAL DE PRECIOS
	sumarTotalPreciosCaja();

	// AGREGAR IMPUESTO
    agregarImpuestoCaja();

	//CALCULAR SI HAY DESCUENTO
	calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

	//CALCULAR SI HAY INTERES
	calcularInteresCaja("nuevoInteresPorcentajeCaja");

    // AGRUPAR PRODUCTOS EN FORMATO JSON
    listarProductosCaja();
	
});

$(".nuevoProductoCaja").on("keyup", "input.nuevaPrecioUnitario", function() {
	
		precioVta = $(this).val();
	
		$(this).closest('.row').find('.nuevoPrecioProductoCaja').attr('precioReal', precioVta);
		
		var precioXCantidad = precioVta * $(this).closest('.row').find('.nuevaCantidadProductoCaja').val();
		precioNeto = precioVta / (($(this).closest('.row').find('.nuevoValorTipoIva').val() / 100) + 1); //precio neto para cantidad 1
		ivaValor = (precioNeto * $(this).closest('.row').find('.nuevoValorTipoIva').val() / 100);// * cantidad;
		//ivaValor = redondear(ivaValor,2);

		var ver =($(this).val() - ivaValor);

		$(this).closest('.row').find('.nuevoTipoIvaValorProducto').val(ivaValor);
	 
	 $(this).closest('.row').find('.nuevoTipoIvaValorProducto').attr('netounitario', ver);// * cantidad;
	
	var precio = $(this).parent().parent().children(".ingresoPrecio").children().children(".nuevoPrecioProductoCaja");
	var cantidad = $(this).closest('.row').find('.nuevaCantidadProductoCaja').val();
	var precioFinal = $(this).val() * cantidad;
	$(this).closest('.row').find('.nuevoPrecioProductoCaja').val(precioFinal);
	
	// SUMAR TOTAL DE PRECIOS
	sumarTotalPreciosCaja();

	// AGREGAR IMPUESTO
    agregarImpuestoCaja();

	//CALCULAR SI HAY DESCUENTO
	calcularDescuentoCaja("nuevoDescuentoPorcentajeCaja");

	//CALCULAR SI HAY INTERES
	calcularInteresCaja("nuevoInteresPorcentajeCaja");

    // AGRUPAR PRODUCTOS EN FORMATO JSON
    listarProductosCaja();
	
	
});

$(".nuevoProductoCaja").on("keyup", "input.nuevaDescripcionProductoCaja", function() {
    // AGRUPAR PRODUCTOS EN FORMATO JSON
    listarProductosCaja();
});

//BOTON PARA AGREGAR MEDIO DE PAGO 
$("#agregarMedioPago").click(function(){
	var metPago = $("#listaMetodoPagoCaja").val();
	if(metPago == 'CC') {
		swal({
    	   title: "Error",
    	   text: "No se puede incluir cuenta corriente en pago mixto",
    	   toast: true,
    	   timer: 3000,
    	   position: 'top',
    	   type: "error",
    	   confirmButtonText: "¡Cerrar!"
    	 });		
		return;
	}
	$("#divImportesPagoMixto").css('display', '');
	var entrega = $("#nuevoValorEntrega").val();
	$("#listadoMetodosPagoMixto").append("<tr><td><span class='quitarMedioPago' style='color: red'><i class='fa fa-minus-square'></i></span></td><td><span class='nuevoTipoMPCaja' entrega='"+entrega+"'>"+metPago+"</span></td><td>"+entrega+"</td></tr>");
	listarMediosPagoCaja();
});

//QUITAR MEDIO DE PAGO EN LISTADO DE PAGO MIXTO
$('#listadoMetodosPagoMixto').on('click', '.quitarMedioPago', function(){
	$(this).closest("tr").remove();
	listarMediosPagoCaja();	
})

/*=============================================
LISTAR TODOS LOS MEDIOS DE PAGO
=============================================*/
function listarMediosPagoCaja(){

	var listaMedioPago = [];
	var tipo = $(".nuevoTipoMPCaja");
	var total = Number($("#nuevoTotalVentaCaja").val());
	var entrado = 0;
	for(var i = 0; i < tipo.length; i++){
		listaMedioPago.push({"tipo" : $(tipo[i]).text(), 
							 "entrega" : $(tipo[i]).attr("entrega")
		});
		entrado += Number($(tipo[i]).attr("entrega"));
	}

	$("#mxMediosPagos").val(JSON.stringify(listaMedioPago));
	$("#nuevoValorSaldo").text(total-entrado);
	$("#nuevoValorEntrega").val(total-entrado);
	
}