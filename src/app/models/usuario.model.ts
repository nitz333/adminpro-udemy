
export class Usuario {

    // Para no declarar cada variable de clase afuera (ya que son varias), lo haremos en las
    // variables del constructor que es lo mismo en TypeScript, solo que en el constructor
    // el orden si importa ya que finalmente son el orden de los parámetros que recibe cuando
    // se crea una instancia de esta clase.
    // También es importante señalar que al usar el constructor de esta forma, a partir de que
    // algún parámetro es opcional, los que siguen deben ser opcionales también.

    // IMPORTANTE: el nombre de los atributos debe corresponder con los que se usen en las peticiones
    //             CRUD en nuestro backend (p.ej. si aquí el atributo se llama 'email' en el backend
    //             los parámetros de las URL deben concordar y no llamarse por decirlo 'correo').
    constructor(
        public nombre: string,
        public primer_apellido: string,
        public email: string,
        public password: string,
        public segundo_apellido = '',
        public img?: string,
        public role?: string,
        public google?: boolean,
        public _id?: string
    )
    {

    }

}