String.prototype.toColor = function () {
    const legendClassColor = ['#5C9EFF', '#4181F4', '#B5F3D8', '#8793AB'];
    let hash = 0;
    if (this.length === 0) return hash;
    for (let i = 0; i < this.length; i++) {
      hash = this.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    hash = ((hash % legendClassColor.length) + legendClassColor.length) % legendClassColor.length;
    return legendClassColor[hash];
  };