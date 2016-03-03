var registerShader = require('../core/shader').registerShader;
var srcLoader = require('../utils/src-loader');
var THREE = require('../lib/three');
var utils = require('../utils/texture');

/**
 * Flat shader.
 *
 * @namespace flat
 * @param {string} color - Diffuse color.
 * @param {boolean} fog - Whether or not to be affected by fog.
 * @param {number} height - Height to render texture.
 * @param {string} repeat - X and Y value for size of texture repeating
 * @param {string} src - To load a texture. takes a selector to an img/video
 *         element or a direct url().
 * @param {number} width - Width to render texture.
 */
module.exports.Component = registerShader('flat', {
  schema: {
    color: { default: '#FFF' },
    fog: { default: true },
    height: { default: 256 },
    repeat: { default: '' },
    src: { default: '' },
    width: { default: 512 }
  },

  /**
   * Initializes the shader.
   * Adds a reference from the scene to this entity as the camera.
   */
  init: function (data) {
    this.textureSrc = null;
    this.material = new THREE.MeshBasicMaterial(getMaterialData(data));
    this.updateTexture(data);
    return this.material;
  },

  update: function (data) {
    this.updateMaterial(data);
    this.updateTexture(data);
    return this.material;
  },

  /**
   * Update or create material.
   *
   * @param {object|null} oldData
   */
  updateTexture: function (data) {
    var src = data.src;
    var material = this.material;
    if (src) {
      if (src === this.textureSrc) { return; }
      // Texture added or changed.
      this.textureSrc = src;
      srcLoader.validateSrc(src, loadImage, loadVideo);
    } else {
      // Texture removed.
      utils.updateMaterial(material, null);
    }
    function loadImage (src) { utils.loadImageTexture(material, src, data.repeat); }
    function loadVideo (src) { utils.loadVideoTexture(material, src, data.width, data.height); }
  },

  /**
   * Updating existing material.
   *
   * @param {object} data - Material component data.
   */
  updateMaterial: function (data) {
    var material = this.material;
    data = getMaterialData(data);
    Object.keys(data).forEach(function (key) {
      material[key] = data[key];
    });
  }
});

/**
 * Builds and normalize material data, normalizing stuff along the way.
 *
 * @param {object} data - Material data.
 * @returns {object} data - Processed material data.
 */
function getMaterialData (data) {
  var materialData = {
    fog: data.fog,
    color: new THREE.Color(data.color)
  };
  return materialData;
}
