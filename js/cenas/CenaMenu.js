export default class CenaMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'CenaMenu' });
  }
  
  preload() {
    // Carrega o background para o menu
    this.load.image('background', '../assets/background.jpg');
  }
  
  create() {
    // Adiciona o cenário
    let fundo = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
    fundo.displayWidth = this.cameras.main.width;
    fundo.displayHeight = this.cameras.main.height;
    
    // Texto de instrução e controles do jogo
    const textoInstrucoes = 
      "Bem-vindo(a) ao Space Pong!\n\n" +
      "Controles:\n" +
      "Jogador da Esquerda: W (para cima) e S (para baixo)\n" +
      "Jogador da Direita: Setas para Cima e para Baixo\n\n" +
      "Regras:\n" +
      "Quando a bola ultrapassar o lado do adversário, o outro jogador marca um ponto.\n\n" +
      "Pressione [ESPAÇO] para iniciar.";
    
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, textoInstrucoes, {
      font: "20px Arial",
      fill: "#ffffff",
      align: "center"
    }).setOrigin(0.5);
    
    // Inicia a cena do jogo ao pressionar a tecla Espaço
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('CenaJogo');
    });
  }
}
