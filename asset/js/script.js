$(document).ready(function() {

    $('#login-form').on('submit', function(event) {
        event.preventDefault();

        // Pediremos un Email y contraseña
        var email = $('#email').val();
        var password = $('#password').val();

        // Si esque estan vacios 
        if (email === "" || password === "") {
            alert("⚠️ Error: Debes completar todos los campos.");
            return;
        }

        // Si usamos el usario k cree aqui
        if (email === "bastian@wallet.com" && password === "123456") {
            
            // Si todo esta ok entramos
            console.log("Login exitoso");
            window.location.href = "menu.html"; 

        } else {
            // Si la clave o correo están mal mandamos esto
            alert("❌ Error: Correo o contraseña incorrectos.");
        }
    });

});

$(document).ready(function() {

    // Cargar un saldo base
    var saldo = localStorage.getItem('saldoWallet') || 1000000;
    saldo = parseInt(saldo);

    if ($('#saldo-actual').length > 0) {
        $('#saldo-actual').text('$' + saldo);
    }

    // cargar movimientos cuando se abre la pestaña de transferencias
    if ($('#cuerpo-tabla').length > 0) {
        cargarMovimientos();
    }

    // deposito
    $('#btn-depositar').on('click', function() {
        var monto = $('#monto-deposito').val();

        if (monto === "" || parseInt(monto) <= 0) {
            alert("Por favor ingresa un monto válido.");
            return;
        }

        saldo = saldo + parseInt(monto);
        localStorage.setItem('saldoWallet', saldo);

        // registro
        registrarMovimiento("Depósito", "+" + monto, "Ingreso");

        alert("¡Depósito exitoso!");
        window.location.href = "menu.html";
    });

    // transferencia
    $('#btn-enviar').on('click', function() {
        var contacto = $('#contacto').val();
        var monto = $('#monto-envio').val();

        if (contacto === null || monto === "" || parseInt(monto) <= 0) {
            alert("Revisa los datos.");
            return;
        }

        if (parseInt(monto) > saldo) {
            alert("❌ Fondos insuficientes.");
            return;
        }

        saldo = saldo - parseInt(monto);
        localStorage.setItem('saldoWallet', saldo);

        // resgitro
        registrarMovimiento("Envío a " + contacto, "-" + monto, "Egreso");

        alert("Transferencia realizada.");
        window.location.href = "menu.html";
    });




    // guardar memoria
    function registrarMovimiento(tipo, monto, categoria) {
        // fecha
        var fecha = new Date().toLocaleDateString();

        // nuevmo movimiento
        var nuevoMovimiento = {
            tipo: tipo,
            monto: monto,
            fecha: fecha,
            categoria: categoria // verdecito o rojito
        };

        // se carga la lista o se crae una nueva 
        var historial = JSON.parse(localStorage.getItem('movimientosWallet')) || [];

        // el mas nuevo al principio
        historial.unshift(nuevoMovimiento);

        // guardar la lista
        localStorage.setItem('movimientosWallet', JSON.stringify(historial));
    }

    // pintar tabla
    function cargarMovimientos() {
        var historial = JSON.parse(localStorage.getItem('movimientosWallet')) || [];
        var html = "";

        // se revisan los movimientos
        historial.forEach(function(mov) {
            
            // se decide si debe ser rojo o verde
            var claseColor = (mov.categoria === "Ingreso") ? "text-success" : "text-danger";

        
            html += `
                <tr>
                    <td>${mov.tipo}</td>
                    <td class="${claseColor} fw-bold">${mov.monto}</td>
                    <td>${mov.fecha}</td>
                    <td class="text-secondary">Completado</td>
                </tr>
            `;
        });

        // se inserta el html en la tablita
        $('#cuerpo-tabla').html(html);
    }

});