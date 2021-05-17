<?php 
    include 'inc/funciones/consultas.php';
    include 'inc/layout/header.php'; 

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if (!$id) {
        die('No es Valido');
    }

    $resultado = obtenerContacto($id);
    $contacto = $resultado->fetch_assoc();
?>



<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="volver" >
            <i class="fas fa-arrow-circle-left"></i>
        </a>
        <h1>Editar Contacto</h1>
    </div>
</div>

<div class="bg-primario contenedor sombra">
<form id="contacto" action="#">
    <legend>Edite el contacto<span>Cualquiera de los tres espacios</span></legend>
    <?php include 'inc/layout/formulario.php'; ?>
</form>
</div>
<?php include 'inc/layout/footer.php'; ?>