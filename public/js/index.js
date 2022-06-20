const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const ponto = document.getElementById('pont')
 
console.log(ponto)

canvas.width = 1024;
canvas.height = 576;

class jogador{
    constructor(){
        this.velocidade = {
            x: 0,
            y: 0
        }

        this.elevacao = 0
        this.opacidade = 1

        const nave_espacial = new Image();
        nave_espacial.src = './assets/spaceship.png'
        nave_espacial.onload = () =>
        {
            var escala = 0.15
            this.image = nave_espacial
            this.width = nave_espacial.width * escala
            this.height = nave_espacial.height * escala

            this.posicao = {
                x: canvas.width / 2 - this.width/ 2,
                y: canvas.height - this.height - 20
            }
        } 
    }

    draw(){
       c.save();
       c.globalAlpha = this.opacidade
       c.translate(Jogador.posicao.x + Jogador.width / 2, 
                   Jogador.posicao.y + Jogador.height / 2);
       c.rotate(this.elevacao)
       c.translate(-Jogador.posicao.x - Jogador.width / 2, 
                   -Jogador.posicao.y - Jogador.height / 2);       
        c.drawImage(this.image, 
                    this.posicao.x, 
                    this.posicao.y, 
                    this.width, 
                    this.height);
       
        c.restore();
    }

    atualizar(){
        if(this.image){
            this.draw();
            this.posicao.x += this.velocidade.x
        }
    }
}

class tiro{
    constructor({posicao, velocidade}){
        this.posicao = posicao
        this.velocidade = velocidade

        this.radius = 5
    }

    draw(){
        c.beginPath();
        c.arc(this.posicao.x, this.posicao.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'blue'
        c.fill()
        c.closePath()
    }

    atualizar(){
        this.draw()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y 
    }
}

class explosaoInvasor{
    constructor({posicao, velocidade, radius, color, fade}){
        this.posicao = posicao
        this.velocidade = velocidade

        this.radius = radius
        this.color = color
        this.opacidade = 1
        this.fade = fade
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacidade
        c.beginPath();
        c.arc(this.posicao.x, this.posicao.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    atualizar(){
        this.draw()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y 

        if(this.fade){
            this.opacidade -= 0.01
        }
    }

}

class tiroInvasor{
    constructor({posicao, velocidade}){
        this.posicao = posicao
        this.velocidade = velocidade

        this.width = 3
        this.height = 10
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.posicao.x, this.posicao.y, this.width, this.height)
    }

    atualizar(){
        this.draw()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y 
    }
}

class invasor{
    constructor({posicao}){
        this.velocidade = {
            x: 0,
            y: 0
        }

        const invasor_espacial = new Image();
        invasor_espacial.src = './assets/invader.png'
        invasor_espacial.onload = () =>
        {
            var escala = 1
            this.image = invasor_espacial
            this.width = invasor_espacial.width * escala
            this.height = invasor_espacial.height * escala

            this.posicao = {
                x: posicao.x,
                y: posicao.y
            }
        } 
    }

    draw(){        
        c.drawImage(this.image, 
                    this.posicao.x, 
                    this.posicao.y, 
                    this.width, 
                    this.height);
    }

    atualizar({velocidade}){
        if(this.image){
            this.draw();
            this.posicao.x += velocidade.x
            this.posicao.y += velocidade.y
        }
    }

  tiro(tiro_invasor){
      tiro_invasor.push(new tiroInvasor({
          posicao:{
              x: this.posicao.x + this.width / 2,
              y: this.posicao.y + this.height
          },
          velocidade:{
              x: 0,
              y: 5
          }
      }))
  }
}

class grade_invasor{
    constructor(){
        this.posicao = {
            x: 0,
            y: 0
        }

        this.velocidade = {
            x: 3,
            y: 0 
        }

        this.invasores = []

        const colunas = Math.floor(Math.random() * 10 + 5)
        const linhas = Math.floor(Math.random() * 5 + 2)
        
        this.width = colunas * 30

        for(let i = 0; i < colunas; i++){
            for(let y = 0; y < linhas; y++){
            this.invasores.push(new invasor({posicao:{
                x: i * 30,
                y: y * 30
            }}))
        }
    }
}


    atualizar(){
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y

        this.velocidade.y = 0

        if(this.posicao.x + this.width >= canvas.width || this.posicao.x <= 0){
            this.velocidade.x = -this.velocidade.x
            this.velocidade.y = 40
        }
    }
}


const Jogador = new jogador()
const Tiro = []
const Grades = []
const tiro_invasor = []
const explosoesInvasores = []



const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    space:{
        pressed: false
    },
}

let frames = 0
let intervalo_inimigo = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    ativo: true
}

let pontuacao = 0

for(let i = 0; i < 200; i++){
    explosoesInvasores.push(new explosaoInvasor({
        posicao:{
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocidade:{
            x: 0,
            y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
  }

function explosao({objeto, color, fade}){
    for(let i = 0; i < 15; i++){
        explosoesInvasores.push(new explosaoInvasor({
            posicao:{
                x: objeto.posicao.x + objeto.width / 2,
                y: objeto.posicao.y + objeto.height / 2
            },
            velocidade:{
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 2,
            color: color || 'violet',
            fade
        }))
      }
}

function animar(){
    if(!game.ativo) return
    requestAnimationFrame(animar)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    Jogador.atualizar()
    explosoesInvasores.forEach((explosao_invasor,index)=>{

        if(explosao_invasor.posicao.y - explosao_invasor.radius >= canvas.height){
            explosao_invasor.posicao.x = Math.random() * canvas.width
            explosao_invasor.posicao.y = -explosao_invasor.radius
        }

        if(explosao_invasor.opacidade <= 0){
            setTimeout(()=>{
             explosoesInvasores.splice(index,1)
            }, 0)
           
        }
        else{
        explosao_invasor.atualizar()
        }
    })
    tiro_invasor.forEach((tiroInvasor, index) => {
        if(tiroInvasor.posicao.y + tiroInvasor.height >= canvas.height){
            setTimeout(() => {
                tiro_invasor.splice(index, 1)
            }, 0) 
        }
        else{
          tiroInvasor.atualizar()
        }

        if(tiroInvasor.posicao.y + tiroInvasor.height >= 
            Jogador.posicao.y && tiroInvasor.posicao.x + tiroInvasor.width >= Jogador.posicao.x
            && tiroInvasor.posicao.x <= Jogador.posicao.x + Jogador.width){
                setTimeout(() => {
                    tiro_invasor.splice(index, 1)
                    Jogador.opacidade = 0
                    game.over = true
                }, 0) 

                setTimeout(() => {
                    game.ativo = false
                }, 2000) 

                explosao({
                    objeto: Jogador,
                    color: 'yellow',
                    fade: true
                })
        }
    })


    Tiro.forEach((tiro,index) =>{
        if(tiro.posicao.y + tiro.radius <= 0){
            setTimeout(() => {
                Tiro.splice(index, 1)
            }, 0) 
        }
        else{
            tiro.atualizar()
        }
    })

    Grades.forEach((grade) => {
        grade.atualizar()
        if(frames % 50 === 0 && grade.invasores.length > 0){
                grade.invasores[Math.floor(Math.random() * grade.invasores.length)].tiro(tiro_invasor)
        }
        grade.invasores.forEach((invasor, i) => {
            invasor.atualizar({velocidade: grade.velocidade})

            Tiro.forEach((tiros, t) => {
                if(tiros.posicao.y - tiros.radius <= invasor.posicao.y + invasor.height
                    && tiros.posicao.x + tiros.radius >= invasor.posicao.x && tiros.posicao.x - tiros.radius <=
                    invasor.posicao.x + invasor.width && tiros.posicao.y + tiros.radius >= invasor.posicao.y){

                    setTimeout(() => {

                        const invasor_encontrado = grade.invasores.find(invasor2 =>  invasor2 === invasor)
                        const tiro_encontrado = Tiro.find(tiros2 => tiros2 === tiros)

                        if(invasor_encontrado && tiro_encontrado){
                            pontuacao += 100
                            ponto.innerHTML = pontuacao
                            explosao({
                                objeto: invasor,
                                fade: true
                            })
                            grade.invasores.splice(i,1)
                            Tiro.splice(t,1)

                            if(grade.invasores.length > 0){
                                const primeiro_invasor = grade.invasores[0]
                                const ultimo_invasor = grade.invasores[grade.invasores.length - 1]

                                grade.width = ultimo_invasor.posicao.x - primeiro_invasor.posicao.x + ultimo_invasor.width
                                grade.posicao.x = primeiro_invasor.posicao.x
                            }
                         
                            
                        }
                       
                    }, 0)
                }
            })
        })
    })

    if(keys.a.pressed && Jogador.posicao.x >= 0){
        Jogador.velocidade.x  = -7;
        Jogador.elevacao = -0.15
    }
    else if(keys.d.pressed && Jogador.posicao.x +Jogador.width <= canvas.width){
        Jogador.velocidade.x  = 7;
        Jogador.elevacao = 0.15
    }
    else{
        Jogador.velocidade.x  = 0;
        Jogador.elevacao = 0
    }

    if(frames % intervalo_inimigo === 0){
        Grades.push(new grade_invasor())
        intervalo_inimigo = Math.floor(Math.random() * 500 + 500)
        frames = 0
        console.log(intervalo_inimigo)
    }

    frames++
}

animar()

addEventListener('keydown', ({key}) =>
{
    if(game.over === false){
    switch(key){
        case 'a':
            console.log('Esquerda');
            keys.a.pressed = true;
            break
        case 'd':
            console.log('Direita');
            keys.d.pressed = true;
            break
        case ' ':
            console.log('Ataque')
            Tiro.push
            (
                new tiro({
                    posicao:{
                        x: Jogador.posicao.x + Jogador.width / 2,
                        y: Jogador.posicao.y
                    },
                    velocidade:{
                        x: 0,
                        y: -10
                    }
                })
            )
            break
    }
  }
});

addEventListener('keyup', ({key}) =>
{
    switch(key){
        case 'a':
            console.log('Esquerda');
            keys.a.pressed = false;
            break
        case 'd':
            console.log('Direita');
            keys.d.pressed = false;
            break
        case ' ':
            console.log('Ataque');
            break
    }
});