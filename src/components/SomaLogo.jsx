// ── SomaLogo ──────────────────────────────────────────────
// Usa o arquivo: src/images/icon-soma.png
// Para trocar a logo, substitua esse arquivo na pasta images.

import logoImg from '../images/icon-soma.png'

/**
 * @param {number} size   – tamanho em px (largura e altura). Padrão: 36
 * @param {string} className – classes extras opcionais
 */
export default function SomaLogo ({ size = 56, className = '' }) {
  return (
    <img
      src={logoImg}
      alt='SOMA logo'
      width={size}
      height={size}
      className={`object-contain flex-shrink-0 ${className}`}
      draggable={false}
    />
  )
}
