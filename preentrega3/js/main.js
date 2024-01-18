let registrosUsuarios = JSON.parse(localStorage.getItem('registrosUsuarios')) || [];
let usuarioActual;

const calculadora = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => (b !== 0 ? a / b : (mostrarMensaje("No se puede dividir por cero"), null)),
};

function mostrarMensaje(mensaje, tipo = 'error') {
  const mensajeElement = document.getElementById('mensaje');
  mensajeElement.textContent = mensaje;
  mensajeElement.className = tipo === 'error' ? 'error' : 'success';


  setTimeout(() => {
    mensajeElement.textContent = '';
    mensajeElement.className = '';
  }, 6000);
}

function registrarUsuario() {
  const nombreUsuario = document.getElementById('nombreUsuario').value.toLowerCase();

  const usuarioExistente = registrosUsuarios.find((usuario) => usuario.nombre === nombreUsuario);

  if (usuarioExistente) {
    mostrarMensaje("El nombre de usuario ya está en uso. Por favor, elija otro.");
    return;
  }

  const nuevaContrasena = document.getElementById('contrasena').value;
  const nuevoUsuario = {
    nombre: nombreUsuario,
    pass: nuevaContrasena,
  };

  registrosUsuarios.push(nuevoUsuario);
  localStorage.setItem('registrosUsuarios', JSON.stringify(registrosUsuarios));
  mostrarMensaje("Usuario registrado correctamente", 'success');
  habilitarOpciones();
}

function login() {
  const nombreUsuario = document.getElementById('nombreUsuario').value.toLowerCase();
  const passUsuario = document.getElementById('contrasena').value;

  const usuarioEncontrado = registrosUsuarios.find(
    (usuario) => usuario.nombre === nombreUsuario && usuario.pass === passUsuario
  );

  if (usuarioEncontrado) {
    usuarioActual = usuarioEncontrado;
    mostrarMensaje("Logueado correctamente", 'success');
    document.getElementById('formulario').style.display = 'none';
    document.getElementById('logged-in').style.display = 'block';
    habilitarOpciones();
  } else {
    mostrarMensaje("Nombre de usuario o contraseña incorrectos.");
  }
}

function habilitarOpciones() {
  document.getElementById('eleccionMenu').disabled = false;
}

function manejarSeleccionMenu() {
  resetearInterfaz();

  const eleccion = document.getElementById('eleccionMenu').value;

  switch (eleccion) {
    case "1":
      document.getElementById('calculoPromedio').style.display = 'block';
      break;
    case "2":
      document.getElementById('operacionesMatematicas').style.display = 'block';
      document.getElementById('realizarOperacionBtn').style.display = 'block';
      break;
    case "3":
      mostrarMensaje("Saliendo del sistema!", 'success');
      resetearInterfaz();
      break;
    default:
      mostrarMensaje("Seleccione una opción válida");
      break;
  }
}

function realizarOperacionMatematica() {
  const num1 = Number(document.getElementById('num1').value);
  const num2 = Number(document.getElementById('num2').value);
  const operacion = document.getElementById('operacion').value;

  const resultado =
    operacion in calculadora
      ? calculadora[operacion](num1, num2)
      : (mostrarMensaje("Operación no válida. Utilice +, -, *, /"), null);

  mostrarResultado(resultado);
}

function mostrarResultado(resultado) {
  if (resultado !== null) {
    mostrarMensaje(`Resultado: ${resultado}`, 'success');
  }
}

function calcularPromedio() {
  const cantidadNotas = Number(document.getElementById('cantidadNotas').value);

  if (isNaN(cantidadNotas) || cantidadNotas <= 0 || cantidadNotas >= 11) {
    mostrarMensaje("Ingrese un número válido, mayor que cero y menor que diez para la cantidad de notas");
    return;
  }

  const notasArray = [];
  const notasContainer = document.getElementById('notasContainer');
  notasContainer.innerHTML = ''; 

  for (let i = 0; i < cantidadNotas; i++) {
    const notaInput = document.createElement('input');
    notaInput.type = 'number';
    notaInput.placeholder = `Ingresa tu nota Nro ${i + 1}`;
    notaInput.classList.add('nota-input');
    notasContainer.appendChild(notaInput);

    notasArray.push(notaInput);
  }

  const calcularPromedioBtn = document.createElement('button');
  calcularPromedioBtn.textContent = 'Calcular Promedio';
  calcularPromedioBtn.addEventListener('click', () => {
    const notasNumericas = notasArray.map((notaInput) => Number(notaInput.value));

    if (notasNumericas.some((nota) => isNaN(nota))) {
      mostrarMensaje("Por favor, ingrese notas válidas.");
      return;
    }

    const sumador = notasNumericas.reduce((acc, nota) => acc + nota, 0);
    const promedio = sumador / notasNumericas.length;
    mostrarMensaje(`El promedio de ${usuarioActual.nombre} es ${promedio.toFixed(2)}`, 'success');
  });

  notasContainer.appendChild(calcularPromedioBtn);
}

function resetearInterfaz() {
  document.getElementById('calculoPromedio').style.display = 'none';
  document.getElementById('operacionesMatematicas').style.display = 'none';
  document.getElementById('realizarOperacionBtn').style.display = 'none';
  document.getElementById('num1').value = '';
  document.getElementById('num2').value = '';
  document.getElementById('operacion').value = '+';
  document.getElementById('cantidadNotas').value = '';
}



document.getElementById('registrarBtn').addEventListener('click', registrarUsuario);
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('realizarOperacionBtn').addEventListener('click', realizarOperacionMatematica);
document.getElementById('calcularPromedioBtn').addEventListener('click', calcularPromedio);
document.getElementById('eleccionMenu').addEventListener('change', manejarSeleccionMenu);