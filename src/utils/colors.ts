export interface ColorItem {
  code: string;
  hex: string;
  name?: string;
}

/**
 * 拼豆色号数据库 - 按色系分类，100+种颜色
 * 100-199: 红/橙红系
 * 200-299: 橙/黄系
 * 300-399: 绿/青绿系
 * 400-499: 蓝/青蓝系
 * 500-599: 紫/紫罗兰系
 * 600-699: 粉/玫红系
 * 700-799: 中性色/灰/黑白
 * 800-899: 棕/米色系
 * 900-999: 补充过渡色
 */
export const pingDouColors: ColorItem[] = [
  // ===== 红色系 (100-149) =====
  { code: '101', hex: '#CC0000', name: '深红' },
  { code: '102', hex: '#E53935', name: '正红' },
  { code: '103', hex: '#EF5350', name: '亮红' },
  { code: '104', hex: '#FF6B6B', name: '珊瑚红' },
  { code: '105', hex: '#FF8A80', name: '浅珊瑚' },
  { code: '106', hex: '#FFCDD2', name: '淡红' },
  // 橙红系
  { code: '111', hex: '#D84315', name: '红橙' },
  { code: '112', hex: '#E64A19', name: '橙红' },
  { code: '113', hex: '#FF5722', name: '朱红' },
  { code: '114', hex: '#FF7043', name: '浅朱红' },
  { code: '115', hex: '#FF8A65', name: '肉橙' },
  { code: '116', hex: '#FFAB91', name: '淡橙红' },

  // ===== 橙/黄色系 (200-299) =====
  { code: '201', hex: '#E65100', name: '深橙' },
  { code: '202', hex: '#EF6C00', name: '橙' },
  { code: '203', hex: '#FF8F00', name: '亮橙' },
  { code: '204', hex: '#FFA726', name: '橙黄' },
  { code: '205', hex: '#FFB74D', name: '浅橙' },
  { code: '206', hex: '#FFCC80', name: '淡橙' },
  // 黄色系
  { code: '211', hex: '#F9A825', name: '金橙' },
  { code: '212', hex: '#FBC02D', name: '金黄' },
  { code: '213', hex: '#FFD700', name: '金色' },
  { code: '214', hex: '#FFE082', name: '米金' },
  { code: '215', hex: '#FFE66D', name: '淡金黄' },
  { code: '216', hex: '#FFF176', name: '浅黄' },
  { code: '217', hex: '#FFEAA7', name: '米黄' },
  { code: '218', hex: '#FFF9C4', name: '极淡黄' },
  // 肤色
  { code: '221', hex: '#FFCCBC', name: '暖肤色' },
  { code: '222', hex: '#FFD3B6', name: '肤色' },
  { code: '223', hex: '#FFE0B2', name: '浅肤色' },

  // ===== 绿色系 (300-399) =====
  { code: '301', hex: '#1B5E20', name: '墨绿' },
  { code: '302', hex: '#2E7D32', name: '深绿' },
  { code: '303', hex: '#388E3C', name: '翠绿' },
  { code: '304', hex: '#43A047', name: '草绿' },
  { code: '305', hex: '#4CAF50', name: '中绿' },
  { code: '306', hex: '#66BB6A', name: '浅绿' },
  { code: '307', hex: '#81C784', name: '嫩绿' },
  { code: '308', hex: '#A5D6A7', name: '淡绿' },
  { code: '309', hex: '#C8E6C9', name: '极淡绿' },
  { code: '310', hex: '#E8F5E9', name: '青白' },
  // 青绿/薄荷
  { code: '321', hex: '#00695C', name: '深青绿' },
  { code: '322', hex: '#00897B', name: '青绿' },
  { code: '323', hex: '#26A69A', name: '碧绿' },
  { code: '324', hex: '#4DB6AC', name: '薄荷绿' },
  { code: '325', hex: '#80CBC4', name: '淡青绿' },
  { code: '326', hex: '#95E1D3', name: '粉绿' },
  { code: '327', hex: '#55EFC4', name: '亮薄荷' },
  { code: '328', hex: '#B2DFDB', name: '极淡青绿' },

  // ===== 蓝色系 (400-499) =====
  { code: '401', hex: '#0D47A1', name: '深蓝' },
  { code: '402', hex: '#1565C0', name: '靛蓝' },
  { code: '403', hex: '#1976D2', name: '中蓝' },
  { code: '404', hex: '#1E88E5', name: '蓝' },
  { code: '405', hex: '#2196F3', name: '亮蓝' },
  { code: '406', hex: '#42A5F5', name: '天蓝' },
  { code: '407', hex: '#64B5F6', name: '浅天蓝' },
  { code: '408', hex: '#90CAF9', name: '淡蓝' },
  { code: '409', hex: '#BBDEFB', name: '极淡蓝' },
  { code: '410', hex: '#E3F2FD', name: '蓝白' },
  // 青蓝/湖蓝
  { code: '421', hex: '#00838F', name: '深湖蓝' },
  { code: '422', hex: '#0097A7', name: '湖蓝' },
  { code: '423', hex: '#00ACC1', name: '亮湖蓝' },
  { code: '424', hex: '#00BCD4', name: '青蓝' },
  { code: '425', hex: '#26C6DA', name: '天青' },
  { code: '426', hex: '#4DD0E1', name: '淡青' },
  { code: '427', hex: '#80DEEA', name: '浅青' },
  { code: '428', hex: '#81ECEC', name: '亮青' },
  { code: '429', hex: '#00CEC9', name: '蓝绿' },
  { code: '430', hex: '#4ECDC4', name: '海蓝' },
  { code: '431', hex: '#B2EBF2', name: '极淡青' },

  // ===== 紫色系 (500-599) =====
  { code: '501', hex: '#311B92', name: '深紫' },
  { code: '502', hex: '#4527A0', name: '紫' },
  { code: '503', hex: '#5E35B1', name: '中紫' },
  { code: '504', hex: '#7E57C2', name: '亮紫' },
  { code: '505', hex: '#9575CD', name: '浅紫' },
  { code: '506', hex: '#B39DDB', name: '淡紫' },
  { code: '507', hex: '#D1C4E9', name: '极淡紫' },
  // 紫罗兰/紫红
  { code: '511', hex: '#6A1B9A', name: '紫罗兰' },
  { code: '512', hex: '#8E24AA', name: '紫红' },
  { code: '513', hex: '#AB47BC', name: '亮紫红' },
  { code: '514', hex: '#CE93D8', name: '浅紫红' },
  { code: '515', hex: '#AA96DA', name: '薰衣草紫' },
  { code: '516', hex: '#DDA0DD', name: '梅紫' },
  { code: '517', hex: '#A29BFE', name: '淡紫蓝' },

  // ===== 粉/玫红系 (600-699) =====
  { code: '601', hex: '#880E4F', name: '深玫红' },
  { code: '602', hex: '#AD1457', name: '玫红' },
  { code: '603', hex: '#C2185B', name: '亮玫红' },
  { code: '604', hex: '#D81B60', name: '粉红' },
  { code: '605', hex: '#E91E63', name: '紫粉' },
  { code: '606', hex: '#F06292', name: '浅粉红' },
  { code: '607', hex: '#F48FB1', name: '粉' },
  { code: '608', hex: '#F8BBD0', name: '淡粉' },
  { code: '609', hex: '#FCE4EC', name: '极淡粉' },
  // 暖粉/桃红
  { code: '611', hex: '#D81B60', name: '桃红' },
  { code: '612', hex: '#E84393', name: '亮桃红' },
  { code: '613', hex: '#FD79A8', name: '樱花粉' },
  { code: '614', hex: '#FF8B94', name: '珊瑚粉' },
  { code: '615', hex: '#FFAAA5', name: '肉粉' },
  { code: '616', hex: '#FFCCD5', name: '极淡粉红' },

  // ===== 中性色/灰/黑白 (700-799) =====
  { code: '701', hex: '#000000', name: '纯黑' },
  { code: '702', hex: '#1A1A1A', name: '黑灰' },
  { code: '703', hex: '#2D3436', name: '深灰' },
  { code: '704', hex: '#424242', name: '灰' },
  { code: '705', hex: '#616161', name: '中灰' },
  { code: '706', hex: '#757575', name: '浅中灰' },
  { code: '707', hex: '#9E9E9E', name: '浅灰' },
  { code: '708', hex: '#BDBDBD', name: '亮灰' },
  { code: '709', hex: '#CFD8DC', name: '银灰' },
  { code: '710', hex: '#DFE6E9', name: '极浅灰' },
  { code: '711', hex: '#ECEFF1', name: '米灰' },
  { code: '712', hex: '#F5F5F5', name: '灰白' },
  { code: '713', hex: '#F5F6FA', name: '米白' },
  { code: '714', hex: '#FFFFFF', name: '纯白' },

  // ===== 棕/米色系 (800-899) =====
  { code: '801', hex: '#3E2723', name: '深棕' },
  { code: '802', hex: '#4E342E', name: '棕' },
  { code: '803', hex: '#5D4037', name: '中棕' },
  { code: '804', hex: '#6D4C41', name: '浅棕' },
  { code: '805', hex: '#795548', name: '土棕' },
  { code: '806', hex: '#8D6E63', name: '灰棕' },
  { code: '807', hex: '#A1887F', name: '淡棕' },
  { code: '808', hex: '#BCAAA4', name: '米棕' },
  { code: '809', hex: '#D7CCC8', name: '暖灰' },
  { code: '810', hex: '#EFEBE9', name: '暖白' },
  // 驼色/卡其
  { code: '821', hex: '#8D6E63', name: '驼色' },
  { code: '822', hex: '#A1887F', name: '浅驼' },
  { code: '823', hex: '#BCAAA4', name: '米驼' },
  { code: '824', hex: '#D7CCC8', name: '粉米' },

  // ===== 补充过渡色 (900-999) =====
  { code: '901', hex: '#37474F', name: '蓝灰' },
  { code: '902', hex: '#455A64', name: '深蓝灰' },
  { code: '903', hex: '#546E7A', name: '中蓝灰' },
  { code: '904', hex: '#607D8B', name: '蓝灰' },
  { code: '905', hex: '#78909C', name: '浅蓝灰' },
  { code: '906', hex: '#90A4AE', name: '亮蓝灰' },
  { code: '907', hex: '#B0BEC5', name: '淡蓝灰' },
  // 橄榄/军绿
  { code: '911', hex: '#33691E', name: '军绿' },
  { code: '912', hex: '#558B2F', name: '橄榄绿' },
  { code: '913', hex: '#689F38', name: '浅橄榄' },
  { code: '914', hex: '#7CB342', name: '黄绿' },
  { code: '915', hex: '#9CCC65', name: '亮黄绿' },
  { code: '916', hex: '#AED581', name: '嫩黄绿' },
]

/** 将十六进制颜色转换为 RGB 对象 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

/** 将 RGB 转换为十六进制颜色 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/** 计算两个颜色之间的欧几里得距离（RGB 空间） */
export const getColorDistance = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  )
}

/**
 * 加权颜色距离 - 考虑到人眼对绿色更敏感，对蓝色不敏感
 * 使用标准加权公式: 2*ΔR^2 + 4*ΔG^2 + 3*ΔB^2
 */
export const getWeightedColorDistance = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const dr = rgb1.r - rgb2.r
  const dg = rgb1.g - rgb2.g
  const db = rgb1.b - rgb2.b
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db)
}

/** 找到最接近的拼豆颜色（使用加权距离算法，还原度更高） */
export const findClosestColor = (hex: string): ColorItem => {
  let minDistance = Infinity
  let closestColor = pingDouColors[0]

  for (const color of pingDouColors) {
    const distance = getWeightedColorDistance(hex, color.hex)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = color
    }
  }

  return closestColor
}