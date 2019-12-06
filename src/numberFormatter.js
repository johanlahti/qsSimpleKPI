/**
 * @preserve IntegraXor Web SCADA - JavaScript Number Formatter
 * http://www.integraxor.com/
 * author: KPL, KHL
 * (c)2011 ecava
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
function formatter(m, v) {
  if (!m || isNaN(+v))
    return v;
  var v = "-" == m.charAt(0) ? -v : +v,
    isNegative = 0 > v ? v = -v : 0,
    result = m.match(/[^\d\-\+#]/g),
    Decimal = result && result[result.length - 1] || ".",
    Group = result && result[1] && result[0] || ",",
    m = m.split(Decimal);
  v = v.toFixed(m[1] && m[1].length),
  v = +v + "";
  var pos_trail_zero = m[1] && m[1].lastIndexOf("0"),
    part = v.split(".");
  (!part[1] || part[1] && part[1].length <= pos_trail_zero) && (v = (+v).toFixed(pos_trail_zero + 1));
  var szSep = m[0].split(Group);
  m[0] = szSep.join("");
  var pos_lead_zero = m[0] && m[0].indexOf("0");
  if (pos_lead_zero > -1)
    for (; part[0].length < m[0].length - pos_lead_zero; )
      part[0] = "0" + part[0];
  else
    0 == +part[0] && (part[0] = "");
  v = v.split("."),
  v[0] = part[0];
  var pos_separator = szSep[1] && szSep[szSep.length - 1].length;
  if (pos_separator) {
    for (var integer = v[0], str = "", offset = integer.length % pos_separator, i = 0, l = integer.length; l > i; i++)
      str += integer.charAt(i), !((i - offset + 1) % pos_separator) && l - pos_separator > i && (str += Group);
    v[0] = str;
  }
  return v[1] = m[1] && v[1] ? Decimal + v[1] : "",
  (isNegative ? "-" : "") + v[0] + v[1];
}

function formatRadix(value, radix, pattern, decimal) {
  return value = value.toString(radix),
  pattern[1] === pattern[1].toUpperCase() && (value = value.toUpperCase()),
  value.length - value.indexOf(".") > 10 && (value = value.slice(0, value.indexOf(".") + 11)),
  value.replace(".", decimal || ".");
}

function formatFunctional(value, pattern, d) {
  var temp;
  return radix.test(pattern) ? value = formatRadix(value, Number(/\d{2}/.exec(pattern)[0]), pattern, d) : oct.test(pattern) ? value = formatRadix(value, 8, pattern, d) : dec.test(pattern) ? value = formatRadix(value, 10, pattern, d) : hex.test(pattern) ? value = formatRadix(value, 16, pattern, d) : bin.test(pattern) ? value = formatRadix(value, 2, pattern, d) : rom.test(pattern) && (temp = "", 0 > value && (temp = "-", value = -value), value = Math.floor(value), 0 === value ? value = "0" : 5e5 >= value ? (value = formatRoman(value, pattern), value = temp + value) : value = pattern + temp + value.toExponential(0)),
  value;
}

function formatRoman(value, pattern) {
  for (var i, s = "", v = Number(String(value).slice(-3)), nThousands = (value - v) / 1e3, decimal = [0, 1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900].reverse(), numeral = ["0", "I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM"].reverse(); v > 0; )
    for (i = 0; i < decimal.length; i++)
      if (decimal[i] <= v) {
        s += numeral[i],
        v -= decimal[i];
        break;
      }
  for (i = 0; nThousands > i; i++)
    s = "M" + s;
  return pattern[1] !== pattern[1].toUpperCase() && (s = s.toLowerCase()),
  s;
}

function preparePattern(o, t, d) {
  var parts, lastPart, numericPattern, prefix, postfix,
    groupTemp, decTemp, temp, regex, pattern = o.pattern;

  pattern.indexOf("A") >= 0 && (pattern = pattern.replace("A", ""), o.abbreviate = !0),
  regex = createRegExp(t, d),
  numericPattern = pattern.match(regex),
  numericPattern = numericPattern ? numericPattern[0] : "",
  prefix = numericPattern ? pattern.substr(0, pattern.indexOf(numericPattern)) : pattern,
  postfix = numericPattern ? pattern.substring(pattern.indexOf(numericPattern) + numericPattern.length) : "",
  numericPattern || (numericPattern = pattern ? "#" : "##########"),
  t && t === d && (parts = numericPattern.split(d), lastPart = parts.pop(), numericPattern = parts.join("") + d + lastPart, t = ""),
  groupTemp = t,
  t = /,/.test(d) ? "¤" : ",",
  groupTemp && (numericPattern = numericPattern.replace(escape(groupTemp, "g"), t)),
  decTemp = d,
  d = ".",
  decTemp && (numericPattern = numericPattern.replace(escape(decTemp, "g"), d)),
  temp = numericPattern.match(/#/g),
  temp = temp ? temp.length : 0,
  o.prefix = prefix || "",
  o.postfix = postfix || "",
  o.pattern = pattern,
  o.percentage = percentage.test(pattern),
  o.numericPattern = numericPattern || "",
  o.numericRegex = new RegExp(escape(t, null, !0) + "|" + escape(d, null, !0), "g"),
  o.groupTemp = groupTemp,
  o.decTemp = decTemp,
  o.t = t,
  o.d = d,
  o.temp = temp;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function escape(value, flags, justStr) {
  var str = escapeRegExp(value);
  return justStr ? str : new RegExp(str || "", flags);
}

function createRegExp(thousand, decimal) {
  return decimal && (decimal = escapeRegExp(decimal)),
  thousand && (thousand = escapeRegExp(thousand)),
  new RegExp("(?:[#0]+" + thousand + ")?[#0]+(?:" + decimal + "[#0]+)?");
}

const DefaultSIprefixes = {
    3 : "k",
    6 : "M",
    9 : "G",
    12 : "T",
    15 : "P",
    18 : "E",
    21 : "Z",
    24 : "Y",
    "-3" : "m",
    "-6" : "μ",
    "-9" : "n",
    "-12" : "p",
    "-15" : "f",
    "-18" : "a",
    "-21" : "z",
    "-24" : "y"
  },
  percentage = /%$/,
  radix = /^\(r(0[2-9]|[12]\d|3[0-6])\)/i,
  oct = /^\(oct\)/i,
  dec = /^\(dec\)/i,
  hex = /^\(hex\)/i,
  bin = /^\(bin\)/i,
  rom = /^\(rom\)/i,
  functional = /^(\(rom\)|\(bin\)|\(hex\)|\(dec\)|\(oct\)|\(r(0[2-9]|[12]\d|3[0-6])\))/i;


  function getAbbreviations(localeInfo) {
    if (!localeInfo || !localeInfo.qNumericalAbbreviation) {
      return  DefaultSIprefixes;
    }
 

    const abbreviations = {};
    const abbrs = localeInfo.qNumericalAbbreviation.split(';');
  
    abbrs.forEach(abbreviation => {
      const abbreviationTuple = abbreviation.split(':');
      if (abbreviationTuple.length === 2) {
        abbreviations[abbreviationTuple[0]] = abbreviationTuple[1];
      }
    });
    return abbreviations;
      
    
   
  }
class NumberFormatter {
  constructor(localeInfo, pattern, thousand, decimal, type) {
    this.localeInfo = localeInfo,
    this.pattern = pattern,
    this.thousandDelimiter = thousand || localeInfo.qThousandSep || ",",
    this.decimalDelimiter = decimal || localeInfo.qDecimalSep || ".",
    this.type = type || "numeric",
    this.abbreviations = getAbbreviations(localeInfo);
    this.prepare();
  }

  clone() {
    var n = new NumberFormatter(this.localeInfo, this.pattern, this.thousandDelimiter, this.decimalDelimiter, this.type);
    return n.subtype = this.subtype,

    n;
  }

  format(value, pattern, t, d) {
    return this.prepare(pattern, t, d),
    this.formatValue(value);
  }

  prepare(pattern, t, d) {
    var prep,
      isFunctional;
    return "undefined" == typeof pattern && (pattern = this.pattern),
    "undefined" == typeof t && (t = this.thousandDelimiter),
    "undefined" == typeof d && (d = this.decimalDelimiter),
    pattern ? (this._prepared = {
      positive : {
        d : d,
        t : t,
        abbreviate : false,
        isFunctional : false,
        prefix : "",
        postfix : ""
      },
      negative : {
        d : d,
        t : t,
        abbreviate : false,
        isFunctional : false,
        prefix : "",
        postfix : ""
      }
    }, prep = this._prepared, pattern = pattern.split(";"), prep.positive.pattern = pattern[0], prep.negative.pattern = pattern[1], functional.test(pattern[0]) && (prep.positive.isFunctional = !0), pattern[1] ? functional.test(pattern[1]) && (prep.negative.isFunctional = !0) : prep.negative = false, isFunctional = prep.positive.isFunctional && (!prep.negative || prep.negative && prep.negative.isFunctional), void(isFunctional || (preparePattern(prep.positive, t, d), prep.negative && preparePattern(prep.negative, t, d)))) : void(this._prepared = {
      pattern : false
    });
  }

  formatValue(value, SIprefixes=DefaultSIprefixes) {
    let temp, exponent, absValue, num, d, t, i, numericPattern,
      decimalPartPattern, prep = this._prepared, abbr = "", sciValue = "";

    if (isNaN(value))
      return value;

    if (prep.pattern === false)
      return value.toString();

    if (0 > value && prep.negative ? (prep = prep.negative, value = -value) : prep = prep.positive, d = prep.d, t = prep.t, prep.isFunctional)
      value = formatFunctional(value, prep.pattern, d);
    else {
      if (prep.percentage) {
        value *= 100;
      }

      if (prep.abbreviate) {
        abbr = getAbbreviations(this.localeInfo);
        const abbreviations = this.abbreviations;
        const abbrArray = Object.keys(abbreviations)
          .map(key => {
            return parseInt(key, 10);
          })
          .sort((a, b) => {
            return a > b ? 1 : -1;
          });
        let lowerAbbreviation;
        let upperAbbreviation = abbrArray[0];
        i = 0;
        exponent = Number(
          Number(value)
            .toExponential()
            .split('e')[1],
            exponent = exponent-exponent % 3,
      exponent in SIprefixes &&
       (abbr = SIprefixes[exponent], 
      value = value/ Math.pow(10, exponent)),
        );

        while (upperAbbreviation <= exponent && i < abbrArray.length) {
          i++;
          upperAbbreviation = abbrArray[i];
        }

        if (i > 0) {
          lowerAbbreviation = abbrArray[i - 1];
        }

        let suggestedAbbrExponent;

        // value and lower abbreviation is for values above 10, use the lower (move to the left <== )
        if (lowerAbbreviation && exponent > 0 && lowerAbbreviation > 0) {
          suggestedAbbrExponent = lowerAbbreviation;
        }
        // value and lower abbreviation is for values below 0.1 (move to the right ==> )
        else if ((exponent < 0 && lowerAbbreviation < 0) || !lowerAbbreviation) {
          // upper abbreviation is also for values below 0.1 and precision allows for using the upper abbreviation ( move to the right ==>)
          if (upperAbbreviation < 0 && upperAbbreviation - exponent <= prep.maxPrecision) {
            suggestedAbbrExponent = upperAbbreviation;
          }
          // lower abbrevaition is smaller than exponent and we can't get away with not abbreviating
          else if (lowerAbbreviation <= exponent && !(upperAbbreviation > 0 && -exponent <= prep.maxPrecision)) {
            // (move to left <==)
            suggestedAbbrExponent = lowerAbbreviation;
          }
        }

        if (suggestedAbbrExponent) {
          abbr = abbr[suggestedAbbrExponent];
          value /= Math.pow(10, suggestedAbbrExponent);
        }
      }

      
      absValue = Math.abs(value);
      temp = prep.temp;
      numericPattern = prep.numericPattern;
      decimalPartPattern = numericPattern.split(d)[1];

      if (this.type === 'I') {
        value = Math.round(value);
      }
      num = value;

      if (!decimalPartPattern && numericPattern.slice(-1)[0] === '#') {
        if (absValue >= Math.pow(10, temp) || absValue < 1 || absValue < 1e-4) {
          if (value === 0) {
            value = '0';
          } else if (absValue < 1e-4 || absValue >= 1e20) {
            // engine always formats values < 1e-4 in scientific form, values >= 1e20 can only be represented in scientific form
            value = num.toExponential(Math.max(1, Math.min(14, temp)) - 1);
            value = value.replace(/\.?0+(?=e)/, '');
            sciValue = '';
          } else {
            value = value.toPrecision(Math.max(1, Math.min(14, temp)));
            if (value.indexOf('.') >= 0) {
              value = value.replace(value.indexOf('e') < 0 ? /0+$/ : /\.?0+(?=e)/, '');
              value = value.replace('.', d);
            }
          }
        } else {
          numericPattern += d;
          temp = Math.max(0, Math.min(20, temp - Math.ceil(Math.log(absValue) / Math.log(10))));
          for (i = 0; i < temp; i++) {
            numericPattern += '#';
          }
          value = formatter(numericPattern, value);
        }
      } else if (absValue >= 1e15 || (absValue > 0 && absValue <= 1e-14)) {
        value = absValue ? absValue.toExponential(15).replace(/\.?0+(?=e)/, '') : '0';
      } else {
        const wholePart = Number(
          value.toFixed(Math.min(20, decimalPartPattern ? decimalPartPattern.length : 0)).split('.')[0]
        );
        let wholePartPattern = numericPattern.split(d)[0];
        wholePartPattern += d;

        value = formatter(wholePartPattern, wholePart) || '0';

        if (decimalPartPattern) {
          const nDecimals = Math.max(0, Math.min(14, decimalPartPattern.length)); // the length of e.g. 0000#####
          const nZeroes = decimalPartPattern.replace(/#+$/, '').length;

          // Added toPrecision to fix rounding errors, fixes SUI-1607
          let decimalPart = Number((absValue % 1).toPrecision(nDecimals)).toFixed(nDecimals);
          decimalPart = decimalPart.slice(2).replace(/0+$/, ''); // remove trailing zeroes

          for (i = decimalPart.length; i < nZeroes; i++) {
            decimalPart += '0';
          }

          if (decimalPart) {
            value += d + decimalPart;
          }
        } else if (wholePart === 0) {
          // to avoid "-" being prefixed to value
          num = 0;
        }
      }

      value = value.replace(prep.numericRegex, m => {
        if (m === t) {
          return prep.groupTemp;
        }
        if (m === d) {
          return prep.decTemp;
        }
        return '';
      });
      if (num < 0 && !/^-/.test(value)) {
        value = `-${value}`;
      }
    }
    

    return prep.prefix + value + sciValue + abbr + prep.postfix;
  }
}

export default NumberFormatter;
