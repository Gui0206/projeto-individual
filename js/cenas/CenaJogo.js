export default class CenaJogo extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaJogo' });
  }
  
  preload() {
    // Carrega os assets: cenário, bola e a imagem da raquete
    this.load.image('background', '../../assets/background.jpg');
    this.load.image('bola', '../../assets/guilherme-ball.png');
    this.load.image('raquete', '../../assets/tennis-racket.png');
    this.load.image('plataforma', '../../assets/plataforma.png');
  }
  
  create() {
    // Adiciona o cenário (background)
    let fundo = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
    fundo.displayWidth = this.cameras.main.width;
    fundo.displayHeight = this.cameras.main.height;
    
    // Inicializa o placar:
    // Formato "x : y" onde x = pontos do jogador da Direita e y = pontos do jogador da Esquerda
    this.pontosEsquerda = 0;  // Jogador da Esquerda
    this.pontosDireita  = 0;  // Jogador da Direita
    this.placar = this.add.text(this.cameras.main.centerX, 20, '0 : 0', {
      font: "20px Arial",
      fill: "#ffffff"
    }).setOrigin(0.5, 0);
    
    // Variável para controlar o fim do jogo
    this.jogoFinalizado = false;
    
    // Cria a raquete do jogador da Esquerda (usa a imagem "raquete")
    this.raqueteEsquerda = this.physics.add.sprite(30, this.cameras.main.centerY, 'raquete');
    this.raqueteEsquerda.setDisplaySize(80, 100);
    this.raqueteEsquerda.setImmovable(true);
    this.raqueteEsquerda.body.allowGravity = false;
    
    // Cria a raquete do jogador da Direita
    this.raqueteDireita = this.physics.add.sprite(this.cameras.main.width - 30, this.cameras.main.centerY, 'raquete');
    this.raqueteDireita.setDisplaySize(80, 100);
    this.raqueteDireita.setImmovable(true);
    this.raqueteDireita.body.allowGravity = false;
    
    // Cria uma plataforma/barreira no centro (exemplo de obstáculo)
    this.plataformas = []; // Lista para demonstrar uso de array
    this.plataformaCentral = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'plataforma');
    this.plataformaCentral.setScale(0.2)
    this.physics.add.existing(this.plataformaCentral, true);
    this.plataformas.push(this.plataformaCentral);
    
    // Cria a bola com física e aumenta seu tamanho
    this.bola = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'bola');
    this.bola.setDisplaySize(40, 40);
    this.bola.setCollideWorldBounds(true);
    this.bola.setBounce(1, 1);
    
    // Animação contínua: a bola gira indefinidamente
    this.tweens.add({
      targets: this.bola,
      angle: 360,
      duration: 1000,
      repeat: -1
    });
    
    // Lança a bola com velocidade e ângulo aleatórios
    this.lancaBola();
    
    // Configura colisões entre a bola e as raquetes
    this.physics.add.collider(this.bola, this.raqueteEsquerda, this.colisaoRaquete, null, this);
    this.physics.add.collider(this.bola, this.raqueteDireita, this.colisaoRaquete, null, this);
    // Configura colisões entre a bola e as plataformas (usando loop na lista)
    for (let plataforma of this.plataformas) {
      this.physics.add.collider(this.bola, plataforma);
    }
    
    // Configura colisões com as paredes: ativa colisões somente para topo e base
    this.physics.world.setBoundsCollision(false, false, true, true);
    
    // Configura os controles:
    // Jogador da Esquerda usa as teclas W (para cima) e S (para baixo)
    this.teclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.teclaS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    
    // Jogador da Direita usa as setas para cima e para baixo
    this.teclaCima = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.teclaBaixo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  
  // Função que lança a bola com velocidade e ângulo aleatórios
  lancaBola() {
    const velocidadeInicial = 300;
    const angulo = Phaser.Math.Between(-45, 45);
    const radiano = Phaser.Math.DegToRad(angulo);
    const direcao = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    this.bola.setVelocity(
      velocidadeInicial * Math.cos(radiano) * direcao,
      velocidadeInicial * Math.sin(radiano)
    );
  }
  
  // Função chamada quando a bola colide com uma raquete
  colisaoRaquete(bola, raquete) {
    const diferenca = bola.y - raquete.y;
    bola.setVelocityY(diferenca * 5);
    
    // Garante que a velocidade horizontal não fique muito baixa
    if (Math.abs(bola.body.velocity.x) < 150) {
      bola.setVelocityX(bola.body.velocity.x < 0 ? -200 : 200);
    }
    
    // Animação: se for a raquete da Esquerda, gira para 15 graus;
    // se for a raquete da Direita, gira para -15 graus.
    const anguloTween = (raquete.x < this.cameras.main.centerX) ? 15 : -15;
    this.tweens.add({
      targets: raquete,
      angle: anguloTween,
      duration: 100,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }
  
  update() {
    // Se o jogo já estiver finalizado, não atualiza controles nem pontuação
    if (this.jogoFinalizado) {
      return;
    }
    
    // CONTROLE DO JOGADOR DA ESQUERDA
    if (this.teclaW.isDown) {
      this.raqueteEsquerda.y -= 5;
      this.raqueteEsquerda.body.updateFromGameObject();
    } else if (this.teclaS.isDown) {
      this.raqueteEsquerda.y += 5;
      this.raqueteEsquerda.body.updateFromGameObject();
    }
    this.raqueteEsquerda.y = Phaser.Math.Clamp(this.raqueteEsquerda.y, 50, this.cameras.main.height - 50);
    this.raqueteEsquerda.body.updateFromGameObject();
    
    // CONTROLE DO JOGADOR DA DIREITA
    if (this.teclaCima.isDown) {
      this.raqueteDireita.y -= 5;
      this.raqueteDireita.body.updateFromGameObject();
    } else if (this.teclaBaixo.isDown) {
      this.raqueteDireita.y += 5;
      this.raqueteDireita.body.updateFromGameObject();
    }
    this.raqueteDireita.y = Phaser.Math.Clamp(this.raqueteDireita.y, 50, this.cameras.main.height - 50);
    this.raqueteDireita.body.updateFromGameObject();
    
    // VERIFICAÇÃO DE PONTUAÇÃO:
    // Se a bola ultrapassar o lado direito, o jogador da Esquerda marca ponto
    if (this.bola.x > this.cameras.main.width) {
      this.pontosEsquerda++;
      this.reiniciaBola(-1);
    }
    // Se a bola ultrapassar o lado esquerdo, o jogador da Direita marca ponto
    else if (this.bola.x < 0) {
      this.pontosDireita++;
      this.reiniciaBola(1);
    }
    
    // Atualiza o placar no formato "x : y"
    this.placar.setText(this.pontosDireita + " : " + this.pontosEsquerda);
    
    // Verifica condição de vitória: limite de 5 pontos
    if (this.pontosEsquerda >= 5 || this.pontosDireita >= 5) {
      this.fimDeJogo();
    }
  }
  
  // Função que reinicia a bola no centro e a relança
  reiniciaBola(direcao) {
    this.bola.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    this.lancaBola();
  }
  
  // Função que trata o fim do jogo, exibindo a mensagem de vitória e voltando ao início
  fimDeJogo() {
    // Sinaliza que o jogo terminou e pausa a física
    this.jogoFinalizado = true;
    this.physics.pause();
    
    let mensagem;
    if (this.pontosEsquerda >= 5) {
      mensagem = "Jogador da Esquerda ganhou!";
    } else {
      mensagem = "Jogador da Direita ganhou!";
    }
    
    // Exibe a mensagem de vitória no centro da tela
    this.add.text(this.cameras.main.centerX, 100, mensagem, {
      font: "32px Arial",
      fill: "#66B2FF"
    }).setOrigin(0.5);
    
    // Após 3 segundos, retorna à CenaMenu (início do jogo)
    this.time.delayedCall(3000, () => {
      this.scene.start('CenaMenu');
    });
  }
}
