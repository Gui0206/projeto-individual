// Importa as cenas: menu e jogo
import CenaMenu from './cenas/CenaMenu.js';
import CenaJogo from './cenas/CenaJogo.js';

// Configuração do jogo
const configuracao = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  // Estrutura com duas cenas: menu/instruções e jogo
  scene: [CenaMenu, CenaJogo]
};

// Cria uma instância do jogo
const jogo = new Phaser.Game(configuracao);
