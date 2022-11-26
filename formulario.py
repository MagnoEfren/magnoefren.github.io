import flet as ft
from flet import TextField,Text, ElevatedButton
from flet import Page, Column,Container, colors
def main(page:Page):
    page.title = 'Formulario de Registro'
    page.horizontal_alignment = "center"
    page.vertical_alignment = "center"
    page.bgcolor = 'black'


    def btn_click(e):
        nombre.value = ""
        documento.value = ""
        correo.value = ""
        telefono.value = ""

        texto.value = 'Datos Guardados'
        page.update()
        nombre.focus()


    nombre = TextField(label="Nombre", autofocus=True)
    documento = TextField(label="Documento de Identidad")
    correo = TextField(label="Correo electronico")
    telefono = TextField(label="Telefono")
    bt_registrar = ElevatedButton("Registrar", on_click=btn_click, width=200, bgcolor=colors.GREEN)

    texto = Text("Hello!")

    page.add( Container( content =
                Column([
                nombre,
                documento,
                correo,
                telefono,
                bt_registrar,
                texto,
                ], spacing = 40,alignment="center",horizontal_alignment = "center")
                
        )
    )

ft.app(target=main)