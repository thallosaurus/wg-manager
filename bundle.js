#!/usr/bin/env deno -A
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/BinaryUtils.js
var require_BinaryUtils = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/BinaryUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.matchingBitCount = exports.intLog2 = exports.cidrPrefixToMaskBinaryString = exports.leftPadWithZeroBit = exports.dottedDecimalNotationToBinaryString = exports.parseBinaryStringToBigInt = exports.decimalNumberToOctetString = exports.numberToBinaryString = void 0;
    var numberToBinaryString = (num) => {
      return num.toString(2);
    };
    exports.numberToBinaryString = numberToBinaryString;
    var decimalNumberToOctetString = (num) => {
      let binaryString = (0, exports.numberToBinaryString)(num);
      let length = binaryString.length;
      if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet");
      }
      return (0, exports.leftPadWithZeroBit)(binaryString, 8);
    };
    exports.decimalNumberToOctetString = decimalNumberToOctetString;
    var parseBinaryStringToBigInt = (num) => {
      return BigInt(`0b${num}`);
    };
    exports.parseBinaryStringToBigInt = parseBinaryStringToBigInt;
    var dottedDecimalNotationToBinaryString = (dottedDecimal) => {
      let stringOctets = dottedDecimal.split(".");
      return stringOctets.reduce((binaryAsString, octet) => {
        return binaryAsString.concat((0, exports.decimalNumberToOctetString)(parseInt(octet)));
      }, "");
    };
    exports.dottedDecimalNotationToBinaryString = dottedDecimalNotationToBinaryString;
    var leftPadWithZeroBit = (binaryString, finalStringLength) => {
      if (binaryString.length > finalStringLength) {
        throw new Error(`Given string is already longer than given final length after padding: ${finalStringLength}`);
      }
      return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
    };
    exports.leftPadWithZeroBit = leftPadWithZeroBit;
    var cidrPrefixToMaskBinaryString = (cidrPrefix, ipType) => {
      let cidrUpperValue;
      if (ipType == "IPv4") {
        cidrUpperValue = 32;
      } else {
        cidrUpperValue = 128;
      }
      if (cidrPrefix > cidrUpperValue) throw Error(`Value is greater than ${cidrUpperValue}`);
      let onBits = "1".repeat(cidrPrefix);
      let offBits = "0".repeat(cidrUpperValue - cidrPrefix);
      return `${onBits}${offBits}`;
    };
    exports.cidrPrefixToMaskBinaryString = cidrPrefixToMaskBinaryString;
    var intLog2 = (givenNumber) => {
      let result = 0;
      while (givenNumber % 2n === 0n) {
        if (givenNumber === 2n) {
          result++;
          break;
        }
        givenNumber = givenNumber >> 1n;
        if (givenNumber % 2n !== 0n) {
          result = 0;
          break;
        }
        result++;
      }
      if (result == 0) {
        throw new Error(`The value of log2 for ${givenNumber.toString()} is not an integer`);
      }
      return result;
    };
    exports.intLog2 = intLog2;
    var matchingBitCount = (firstBinaryString, secondBinaryString) => {
      let longerString;
      let otherString;
      if (firstBinaryString.length >= secondBinaryString.length) {
        longerString = firstBinaryString;
        otherString = secondBinaryString;
      } else {
        longerString = secondBinaryString;
        otherString = firstBinaryString;
      }
      let count = 0;
      for (; count < longerString.length; count++) {
        if (longerString.charAt(count) === otherString.charAt(count)) {
          continue;
        }
        break;
      }
      return count;
    };
    exports.matchingBitCount = matchingBitCount;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPv6Utils.js
var require_IPv6Utils = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPv6Utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.collapseIPv6Number = exports.expandIPv6Number = void 0;
    var BinaryUtils_1 = require_BinaryUtils();
    var Validator_1 = require_Validator();
    var extractPrefix = (ipv6String) => {
      return ipv6String.includes("/") ? `/${ipv6String.split("/")[1]}` : "";
    };
    var expandIPv6Number = (ipv6String) => {
      let expandWithZero = (hexadecimalArray) => {
        let paddedArray = [];
        hexadecimalArray.forEach((hexadecimal) => {
          if (hexadecimal.includes(".")) {
            const [v4part1, v4part2] = (0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(hexadecimal).match(/.{1,16}/g).map((bin) => (0, BinaryUtils_1.parseBinaryStringToBigInt)(bin).toString(16));
            paddedArray.push((0, BinaryUtils_1.leftPadWithZeroBit)(v4part1, 4));
            paddedArray.push((0, BinaryUtils_1.leftPadWithZeroBit)(v4part2, 4));
          } else {
            paddedArray.push((0, BinaryUtils_1.leftPadWithZeroBit)(hexadecimal, 4));
          }
        });
        return paddedArray.join(":");
      };
      let expandDoubleColon = (gapCount) => {
        let pads = [];
        for (let count = 0; count < gapCount; count++) {
          pads.push("0000");
        }
        return pads.join(":");
      };
      if (/(:){3,}/.test(ipv6String)) throw "given IPv6 contains consecutive : more than two";
      const prefix = extractPrefix(ipv6String);
      if (ipv6String.includes("/")) {
        ipv6String = ipv6String.split("/")[0];
      }
      let isValid = Validator_1.Validator.IPV6_PATTERN.test(ipv6String);
      if (!isValid) {
        throw Error(Validator_1.Validator.invalidIPv6PatternMessage);
      }
      if (ipv6String.includes("::")) {
        let split = ipv6String.split("::");
        let leftPortion = split[0];
        let rightPortion = split[1];
        let leftPortionSplit = leftPortion.split(":").filter((hexadecimal) => {
          return hexadecimal !== "";
        });
        let rightPortionSplit = rightPortion.split(":").filter((hexadecimal) => {
          return hexadecimal !== "";
        });
        let extra = leftPortionSplit.concat(rightPortionSplit).filter((part) => part.includes(".")).length;
        let doublePortion = expandDoubleColon(8 - (leftPortionSplit.length + rightPortionSplit.length + extra));
        let leftString = expandWithZero(leftPortionSplit);
        if (leftString !== "") {
          leftString += ":";
        }
        let rightString = expandWithZero(rightPortionSplit);
        if (rightString !== "") {
          rightString = ":" + rightString;
        }
        return `${leftString}${doublePortion}${rightString}${prefix}`;
      } else {
        return `${expandWithZero(ipv6String.split(":"))}${prefix}`;
      }
    };
    exports.expandIPv6Number = expandIPv6Number;
    var shortenHexadecatet = (hex) => {
      const withoutLeadingZero = hex.replace(/^0+/, "");
      return withoutLeadingZero === "" ? "0" : withoutLeadingZero;
    };
    var collapseIPv6Number = (ipv6String) => {
      const originalPrefix = extractPrefix(ipv6String);
      const processedIPv6String = ipv6String.includes("/") ? ipv6String.split("/")[0] : ipv6String;
      let expandedIPv6 = "";
      try {
        let tempExpanded = (0, exports.expandIPv6Number)(processedIPv6String);
        if (tempExpanded.includes("/")) {
          expandedIPv6 = tempExpanded.split("/")[0];
        } else {
          expandedIPv6 = tempExpanded;
        }
      } catch (e) {
        throw e;
      }
      let hexadecatets = expandedIPv6.split(":");
      if (hexadecatets.length !== 8) {
        throw new Error(`Invalid IPv6 structure after expansion: ${expandedIPv6}. Expected 8 segments.`);
      }
      let zeroSequences = [];
      let currentSequenceStart = -1;
      let currentSequenceLength = 0;
      for (let i = 0; i < 8; i++) {
        if (hexadecatets[i] === "0000") {
          if (currentSequenceStart === -1) {
            currentSequenceStart = i;
          }
          currentSequenceLength++;
        } else {
          if (currentSequenceLength > 0) {
            zeroSequences.push({
              start: currentSequenceStart,
              length: currentSequenceLength
            });
          }
          currentSequenceStart = -1;
          currentSequenceLength = 0;
        }
      }
      if (currentSequenceLength > 0) {
        zeroSequences.push({
          start: currentSequenceStart,
          length: currentSequenceLength
        });
      }
      if (zeroSequences.length === 0) {
        return hexadecatets.map(shortenHexadecatet).join(":") + originalPrefix;
      }
      zeroSequences.sort((a, b) => {
        if (b.length !== a.length) {
          return b.length - a.length;
        }
        return a.start - b.start;
      });
      const bestSequence = zeroSequences[0];
      if (bestSequence.length === 8) {
        return "::" + originalPrefix;
      }
      if (bestSequence.length < 2) {
        return hexadecatets.map(shortenHexadecatet).join(":") + originalPrefix;
      }
      let leftPartSegments = hexadecatets.slice(0, bestSequence.start);
      let rightPartSegments = hexadecatets.slice(bestSequence.start + bestSequence.length);
      let leftString = leftPartSegments.map(shortenHexadecatet).join(":");
      let rightString = rightPartSegments.map(shortenHexadecatet).join(":");
      let finalStr = "";
      if (bestSequence.start === 0) {
        finalStr = "::" + rightString;
      } else if (bestSequence.start + bestSequence.length === 8) {
        finalStr = leftString + "::";
      } else {
        finalStr = leftString + "::" + rightString;
      }
      return finalStr + originalPrefix;
    };
    exports.collapseIPv6Number = collapseIPv6Number;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/HexadecimalUtils.js
var require_HexadecimalUtils = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/HexadecimalUtils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.hexadectetNotationToBinaryString = exports.binaryStringToHexadecimalString = exports.colonHexadecimalNotationToBinaryString = exports.hexadecimalStringToHexadecatetString = exports.hexadecimalStringToBinaryString = exports.bigIntToHexadecimalString = void 0;
    var IPv6Utils_1 = require_IPv6Utils();
    var BinaryUtils_1 = require_BinaryUtils();
    var bigIntToHexadecimalString = (num) => {
      return num.toString(16);
    };
    exports.bigIntToHexadecimalString = bigIntToHexadecimalString;
    var hexadecimalStringToBinaryString = (hexadecimalString) => {
      let inDecimal = BigInt(`0x${hexadecimalString}`);
      return inDecimal.toString(2);
    };
    exports.hexadecimalStringToBinaryString = hexadecimalStringToBinaryString;
    var hexadecimalStringToHexadecatetString = (hexadecimalString) => {
      let binaryString = (0, exports.hexadecimalStringToBinaryString)(hexadecimalString);
      let length = binaryString.length;
      if (length > 16) {
        throw new Error("Given decimal in binary contains digits greater than an Hexadecatet");
      }
      return (0, BinaryUtils_1.leftPadWithZeroBit)(binaryString, 16);
    };
    exports.hexadecimalStringToHexadecatetString = hexadecimalStringToHexadecatetString;
    var colonHexadecimalNotationToBinaryString = (hexadecimalString) => {
      let expandedIPv6 = (0, IPv6Utils_1.expandIPv6Number)(hexadecimalString);
      let stringHexadecimal = expandedIPv6.split(":");
      return stringHexadecimal.reduce((binaryAsString, hexidecimal) => {
        return binaryAsString.concat((0, exports.hexadecimalStringToHexadecatetString)(hexidecimal));
      }, "");
    };
    exports.colonHexadecimalNotationToBinaryString = colonHexadecimalNotationToBinaryString;
    var binaryStringToHexadecimalString = (num) => {
      let inDecimal = BigInt(`0b${num}`);
      return inDecimal.toString(16);
    };
    exports.binaryStringToHexadecimalString = binaryStringToHexadecimalString;
    var hexadectetNotationToBinaryString = (hexadectetString) => {
      let expand = (0, IPv6Utils_1.expandIPv6Number)(hexadectetString);
      let hexadecimals = expand.split(":");
      return hexadecimals.reduce((hexadecimalAsString, hexavalue) => {
        return hexadecimalAsString.concat((0, BinaryUtils_1.leftPadWithZeroBit)((0, exports.hexadecimalStringToBinaryString)(hexavalue), 16));
      }, "");
    };
    exports.hexadectetNotationToBinaryString = hexadectetNotationToBinaryString;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Validator.js
var require_Validator = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Validator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Validator = void 0;
    var BinaryUtils_1 = require_BinaryUtils();
    var BinaryUtils_2 = require_BinaryUtils();
    var IPv6Utils_1 = require_IPv6Utils();
    var HexadecimalUtils_1 = require_HexadecimalUtils();
    var HexadecimalUtils_2 = require_HexadecimalUtils();
    var Validator = class _Validator {
      /**
         * Checks if given ipNumber is in between the given lower and upper bound
         *
         * @param ipNumber ipNumber to check
         * @param lowerBound lower bound
         * @param upperBound upper bound
         * @returns {boolean} true if ipNumber is between lower and upper bound
         */
      static isWithinRange(ipNumber, lowerBound, upperBound) {
        return ipNumber >= lowerBound && ipNumber <= upperBound;
      }
      /**
         * Checks if the number given is within the value considered valid for an ASN number
         *
         * @param asnNumber the asn number to validate
         * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
         * "valid" or an error message when value is invalid
         */
      static isValidAsnNumber(asnNumber) {
        let isValid = this.isWithinRange(asnNumber, 0n, this.THIRTY_TWO_BIT_SIZE);
        return [
          isValid,
          isValid ? [] : [
            _Validator.invalidAsnRangeMessage
          ]
        ];
      }
      /**
         * Checks if the given ASN number is a 16bit ASN number
         *
         * @param {bigint} asnNumber to check if 16bit or not
         * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
         * "valid" or an error message when value is invalid
         */
      static isValid16BitAsnNumber(asnNumber) {
        let isValid = _Validator.isWithinRange(asnNumber, 0n, _Validator.SIXTEEN_BIT_SIZE);
        return [
          isValid,
          isValid ? [] : [
            _Validator.invalid16BitAsnRangeMessage
          ]
        ];
      }
      /**
         * Checks if the number given is within the value considered valid for an IPv4 number
         *
         * @param ipv4Number the asn number to validate
         * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
         * "valid" or an error message when value is invalid
         */
      static isValidIPv4Number(ipv4Number) {
        ipv4Number = typeof ipv4Number === "bigint" ? ipv4Number : BigInt(ipv4Number);
        let isValid = this.isWithinRange(ipv4Number, 0n, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.invalidIPv4NumberMessage
          ]
        ];
      }
      /**
         * Checks if the number given is within the value considered valid for an IPv6 number
         *
         * @param ipv6Number the asn number to validate
         * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
         * "valid" or an error message when value is invalid
         */
      static isValidIPv6Number(ipv6Number) {
        let isValid = this.isWithinRange(ipv6Number, 0n, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.invalidIPv6NumberMessage
          ]
        ];
      }
      /**
         * Checks if the number given is valid for an IPv4 octet
         *
         * @param octetNumber the octet value
         * @returns {boolean} true if valid octet, false otherwise
         */
      static isValidIPv4Octet(octetNumber) {
        let withinRange = this.isWithinRange(octetNumber, 0n, this.EIGHT_BIT_SIZE);
        return [
          withinRange,
          withinRange ? [] : [
            _Validator.invalidOctetRangeMessage
          ]
        ];
      }
      /**
         * Checks if the number given is valid for an IPv6 hexadecatet
         *
         * @param {bigint} hexadecatetNum the hexadecatet value
         * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
         * "valid" or an error message when value is invalid
         */
      static isValidIPv6Hexadecatet(hexadecatetNum) {
        let isValid = this.isWithinRange(hexadecatetNum, 0n, this.SIXTEEN_BIT_SIZE);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.invalidHexadecatetMessage
          ]
        ];
      }
      /**
         * Checks if given string is a valid IPv4 value.
         *
         * @param {string} ipv4String the IPv4 string to validate
         * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
         * contains error message if invalid IPv4
         */
      static isValidIPv4String(ipv4String) {
        let rawOctets = ipv4String.split(".");
        if (rawOctets.length != 4 || rawOctets.includes("")) {
          return [
            false,
            [
              _Validator.invalidOctetCountMessage
            ]
          ];
        }
        let isValid = rawOctets.every((octet) => {
          return _Validator.isNumeric(octet) ? _Validator.isValidIPv4Octet(BigInt(octet))[0] : false;
        });
        if (!isValid) {
          return [
            false,
            [
              _Validator.invalidOctetRangeMessage
            ]
          ];
        }
        isValid = _Validator.IPV4_PATTERN.test(ipv4String);
        return [
          isValid,
          isValid ? [] : [
            _Validator.invalidIPv4PatternMessage
          ]
        ];
      }
      /**
         * Checks if given string is a valid IPv6 value.
         *
         * @param {string} ipv6String the IPv6 string to validate
         * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
         * contains error message if invalid IPv6
         */
      static isValidIPv6String(ipv6String) {
        let [ipv6, zoneId, ...rest] = ipv6String.split("%");
        if (rest.length > 0) {
          return [
            false,
            [
              _Validator.invalidIPv6PatternMessage
            ]
          ];
        }
        if (zoneId && !_Validator.ZONE_INDEX_PATTERN.test(zoneId)) {
          return [
            false,
            [
              _Validator.invalidIPv6PatternMessage
            ]
          ];
        }
        if (ipv6String.includes("%") && !zoneId) {
          return [
            false,
            [
              _Validator.invalidIPv6PatternMessage
            ]
          ];
        }
        try {
          let hexadecimals = (0, IPv6Utils_1.expandIPv6Number)(ipv6).split(":");
          if (hexadecimals.length != 8) {
            return [
              false,
              [
                _Validator.invalidHexadecatetCountMessage
              ]
            ];
          }
          let isValid = hexadecimals.every((hexadecimal) => {
            return _Validator.isHexadecatet(hexadecimal) ? _Validator.isValidIPv6Hexadecatet(BigInt(`0x${hexadecimal}`))[0] : false;
          });
          if (!isValid) {
            return [
              false,
              [
                _Validator.invalidHexadecatetMessage
              ]
            ];
          }
          isValid = _Validator.IPV6_PATTERN.test(ipv6);
          if (!isValid) {
            return [
              false,
              [
                _Validator.invalidIPv6PatternMessage
              ]
            ];
          }
          return [
            isValid,
            []
          ];
        } catch (error) {
          return [
            false,
            [
              String(error)
            ]
          ];
        }
      }
      /**
         * Checks if given value is a valid prefix value
         *
         * @param prefixValue value to check
         * @param ipNumType The type of IP number
         * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
         */
      static isValidPrefixValue(prefixValue, ipNumType) {
        if ("IPv4" === ipNumType) {
          let withinRange = _Validator.isWithinRange(BigInt(prefixValue), 0n, 32n);
          return [
            withinRange,
            withinRange ? [] : [
              _Validator.invalidPrefixValueMessage
            ]
          ];
        }
        if ("IPv6" === ipNumType) {
          let withinRange = _Validator.isWithinRange(BigInt(prefixValue), 0n, 128n);
          return [
            withinRange,
            withinRange ? [] : [
              _Validator.invalidPrefixValueMessage
            ]
          ];
        }
        return [
          false,
          [
            _Validator.invalidInetNumType
          ]
        ];
      }
      /**
         * Checks if given string is a valid IPv4 mask
         *
         * @param {string} ipv4MaskString the given IPv4 mask string
         * @returns {[boolean , string]} first value is true if valid IPv4 mask string, false otherwise. Second value
         * contains "valid" or an error message when value is invalid
         */
      static isValidIPv4Mask(ipv4MaskString) {
        let ipv4InBinary = (0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(ipv4MaskString);
        let isValid = _Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.invalidMaskMessage
          ]
        ];
      }
      /**
         * Checks if given string is a valid IPv6 mask
         *
         * @param {string} ipv6MaskString the given IPv6 mask string
         * @returns {[boolean , string]} first value is true if valid IPv6 mask string, false otherwise. Second value
         * contains "valid" or an error message when value is invalid
         */
      static isValidIPv6Mask(ipv6MaskString) {
        try {
          let ipv6InBinary = (0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(ipv6MaskString);
          let isValid = _Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv6InBinary);
          return isValid ? [
            isValid,
            []
          ] : [
            isValid,
            [
              _Validator.invalidMaskMessage
            ]
          ];
        } catch (error) {
          return [
            false,
            [
              String(error)
            ]
          ];
        }
      }
      /**
         * Checks if the given string is a valid IPv4 range in Cidr notation
         *
         * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
         *
         * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
         * value contains "valid" or an error message when value is invalid
         */
      static isValidIPv4CidrNotation(ipv4RangeAsCidrString) {
        let cidrComponents = ipv4RangeAsCidrString.split("/");
        if (cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
          return [
            false,
            [
              _Validator.invalidIPv4CidrNotationMessage
            ]
          ];
        }
        let ip = cidrComponents[0];
        let range = cidrComponents[1];
        if (!/^\d+$/.test(range)) {
          return [
            false,
            [
              _Validator.invalidIPv4CidrNotationMessage
            ]
          ];
        }
        if (isNaN(Number(range))) {
          return [
            false,
            [
              _Validator.invalidIPv4CidrNotationMessage
            ]
          ];
        }
        let [validIpv4, invalidIpv4Message] = _Validator.isValidIPv4String(ip);
        let [validPrefix, invalidPrefixMessage] = _Validator.isValidPrefixValue(
          BigInt(range),
          "IPv4"
          /* IPNumType.IPv4 */
        );
        let isValid = validIpv4 && validPrefix;
        let invalidMessage = invalidIpv4Message.concat(invalidPrefixMessage);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          invalidMessage
        ];
      }
      /**
         *  Checks if the given string is a valid IPv4 range in Cidr notation, with the ip number in the cidr notation
         *  being the start of the range
         *
         * @param {string}  ipv4CidrNotation the IPv4 range in Cidr notation
         *
         * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
         * value contains [] or an array of error message when invalid
         */
      static isValidIPv4CidrRange(ipv4CidrNotation) {
        return _Validator.isValidCidrRange(ipv4CidrNotation, _Validator.isValidIPv4CidrNotation, BinaryUtils_1.dottedDecimalNotationToBinaryString, (value) => (0, BinaryUtils_2.cidrPrefixToMaskBinaryString)(
          value,
          "IPv4"
          /* IPNumType.IPv4 */
        ));
      }
      /**
         *  Checks if the given string is a valid IPv6 range in Cidr notation, with the ip number in the cidr notation
         *  being the start of the range
         *
         * @param {string}  ipv6CidrNotation the IPv6 range in Cidr notation
         *
         * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
         * value contains [] or an array of error message when invalid
         */
      static isValidIPv6CidrRange(ipv6CidrNotation) {
        return _Validator.isValidCidrRange(ipv6CidrNotation, _Validator.isValidIPv6CidrNotation, HexadecimalUtils_1.colonHexadecimalNotationToBinaryString, (value) => (0, BinaryUtils_2.cidrPrefixToMaskBinaryString)(
          value,
          "IPv6"
          /* IPNumType.IPv6 */
        ));
      }
      static isValidCidrRange(rangeString, cidrNotationValidator, toBinaryStringConverter, prefixFactory) {
        let validationResult = cidrNotationValidator(rangeString);
        if (!validationResult[0]) {
          return validationResult;
        }
        let cidrComponents = rangeString.split("/");
        let ip = cidrComponents[0];
        let range = cidrComponents[1];
        let ipNumber = BigInt(`0b${toBinaryStringConverter(ip)}`);
        let mask = BigInt(`0b${prefixFactory(parseInt(range))}`);
        let isValid = (ipNumber & mask) === ipNumber;
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.InvalidIPCidrRangeMessage
          ]
        ];
      }
      static isValidIPv4RangeString(ipv4RangeString) {
        let firstLastValidator = (firstIP, lastIP) => BigInt(`0b${(0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(firstIP)}`) >= BigInt(`0b${(0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(lastIP)}`);
        return this.isValidRange(ipv4RangeString, _Validator.isValidIPv4String, firstLastValidator);
      }
      static isValidIPv6RangeString(ipv6RangeString) {
        let firstLastValidator = (firstIP, lastIP) => BigInt(`0b${(0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(firstIP)}`) >= BigInt(`0b${(0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(lastIP)}`);
        return this.isValidRange(ipv6RangeString, _Validator.isValidIPv6String, firstLastValidator);
      }
      static isValidRange(rangeString, validator, firstLastValidator) {
        let rangeComponents = rangeString.split("-").map((component) => component.trim());
        if (rangeComponents.length !== 2 || (rangeComponents[0].length === 0 || rangeComponents[1].length === 0)) {
          return [
            false,
            [
              _Validator.invalidRangeNotationMessage
            ]
          ];
        }
        let firstIP = rangeComponents[0];
        let lastIP = rangeComponents[1];
        let [validFirstIP, invalidFirstIPMessage] = validator(firstIP);
        let [validLastIP, invalidLastIPMessage] = validator(lastIP);
        let isValid = validFirstIP && validLastIP;
        if (isValid && firstLastValidator(firstIP, lastIP)) {
          return [
            false,
            [
              _Validator.invalidRangeFirstNotGreaterThanLastMessage
            ]
          ];
        }
        let invalidMessage = invalidFirstIPMessage.concat(invalidLastIPMessage);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          invalidMessage
        ];
      }
      /**
         * Checks if the given string is a valid IPv6 range in Cidr notation
         *
         * @param {string} ipv6RangeAsCidrString the IPv6 range in Cidr notation
         *
         * @returns {[boolean , string]} first value is true if valid IPv6 range in Cidr notation, false otherwise.
         * Second value contains "valid" or an error message when value is invalid
         */
      // TODO change to be like isValidIPv4CidrNotation where validation is done on the component of the cidr notation
      // instead of a single regex check
      static isValidIPv6CidrNotation(ipv6RangeAsCidrString) {
        let cidrComponents = ipv6RangeAsCidrString.split("/");
        if (cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
          return [
            false,
            [
              _Validator.invalidIPv6CidrNotationString
            ]
          ];
        }
        let isValid = _Validator.IPV6_RANGE_PATTERN.test(ipv6RangeAsCidrString);
        return isValid ? [
          isValid,
          []
        ] : [
          isValid,
          [
            _Validator.invalidIPv6CidrNotationString
          ]
        ];
      }
      /**
         * Checks if the given string is a binary string. That is contains only contiguous 1s and 0s
         *
         * @param {string} binaryString the binary string
         * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
         */
      static isValidBinaryString(binaryString) {
        if (/^([10])+$/.test(binaryString)) {
          return [
            true,
            []
          ];
        } else {
          return [
            false,
            [
              _Validator.invalidBinaryStringErrorMessage
            ]
          ];
        }
      }
      static isNumeric(value) {
        return /^(\d+)$/.test(value);
      }
      static isHexadecatet(value) {
        return /^[0-9A-Fa-f]{4}$/.test(value);
      }
    };
    exports.Validator = Validator;
    Validator.IPV4_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
    Validator.IPV6_PATTERN = new RegExp(/^(((?:[0-9A-Fa-f]{1,4}:){7}(?:[0-9A-Fa-f]{1,4}|:))|((?:[0-9A-Fa-f]{1,4}:){6}(?::[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|((?:[0-9A-Fa-f]{1,4}:){5}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|((?:[0-9A-Fa-f]{1,4}:){4}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,3})|(?:(?::[0-9A-Fa-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|((?:[0-9A-Fa-f]{1,4}:){3}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,4})|(?:(?::[0-9A-Fa-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|((?:[0-9A-Fa-f]{1,4}:){2}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,5})|(?:(?::[0-9A-Fa-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|((?:[0-9A-Fa-f]{1,4}:){1}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|(?:(?::[0-9A-Fa-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9A-Fa-f]{1,4}){1,7})|(?:(?::[0-9A-Fa-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?$/);
    Validator.ZONE_INDEX_PATTERN = new RegExp(/^[a-zA-Z0-9]*$/);
    Validator.IPV4_RANGE_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    Validator.IPV6_RANGE_PATTERN = new RegExp(/^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
    Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,32}(0){0,32}$/);
    Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,128}(0){0,128}$/);
    Validator.EIGHT_BIT_SIZE = BigInt(`0b${"1".repeat(8)}`);
    Validator.SIXTEEN_BIT_SIZE = BigInt(`0b${"1".repeat(16)}`);
    Validator.THIRTY_TWO_BIT_SIZE = BigInt(`0b${"1".repeat(32)}`);
    Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE = BigInt(`0b${"1".repeat(128)}`);
    Validator.IPV4_SIZE = BigInt("4294967296");
    Validator.IPV6_SIZE = BigInt("340282366920938463463374607431768211456");
    Validator.invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    Validator.invalid16BitAsnRangeMessage = "ASN number given less than zero or is greater than 16bit";
    Validator.invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    Validator.invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
    Validator.invalidOctetRangeMessage = "Value given contains an invalid Octet; Value is less than zero or is greater than 8bit";
    Validator.invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
    Validator.invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    Validator.invalidHexadecatetCountMessage = "An IP6 number must have exactly 8 hexadecatet";
    Validator.invalidMaskMessage = "The Mask is invalid";
    Validator.invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32";
    Validator.invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip number]/[range]";
    Validator.InvalidIPCidrRangeMessage = "Given IP number portion must is not the start of the range";
    Validator.invalidRangeNotationMessage = "Range notation should be in the form [first ip]-[last ip]";
    Validator.invalidRangeFirstNotGreaterThanLastMessage = "First IP in [first ip]-[last ip] must be less than Last IP";
    Validator.invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 number and prefix";
    Validator.takeOutOfRangeSizeMessage = "$count is greater than $size, the size of the range";
    Validator.cannotSplitSingleRangeErrorMessage = "Cannot split an IP range with a single IP number";
    Validator.invalidInetNumType = "Given ipNumType must be either InetNumType.IPv4 or InetNumType.IPv6";
    Validator.invalidBinaryStringErrorMessage = "Binary string should contain only contiguous 1s and 0s";
    Validator.invalidIPRangeSizeMessage = "Given size is zero or greater than maximum size of $iptype";
    Validator.invalidIPRangeSizeForCidrMessage = "Given size can't be created via cidr prefix";
    Validator.invalidIPv4PatternMessage = "Given IPv4 is not confirm to a valid IPv6 address";
    Validator.invalidIPv6PatternMessage = "Given IPv6 is not confirm to a valid IPv6 address";
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Hexadecatet.js
var require_Hexadecatet = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Hexadecatet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Hexadecatet = void 0;
    var Validator_1 = require_Validator();
    var Hexadecatet = class _Hexadecatet {
      /**
         * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
         * representation of a 16bit value.
         *
         * @param {string} rawValue the four (base 16) number
         * @returns {Hexadecatet} an instance of {@link Hexadecatet}
         */
      static fromString(rawValue) {
        return new _Hexadecatet(rawValue);
      }
      /**
         * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
         * of a 16 bit value
         *
         * @param {number} rawValue decimal number representation of a 16 bit value
         * @returns {Hexadecatet} an instance of {@link Hexadecatet}
         */
      static fromNumber(rawValue) {
        return new _Hexadecatet(rawValue);
      }
      /**
         * Constructor for creating an instance of {@link Hexadecatet}
         *
         * @param {string | number} givenValue a string or numeric value. If given value is a string then it should be a
         * four (base 16) number representation of a 16bit value. If it is a number, then it should be a decimal number
         * representation of a 16 bit value
         */
      constructor(givenValue) {
        let hexadecatetValue;
        if (typeof givenValue === "string") {
          hexadecatetValue = parseInt(givenValue, 16);
        } else {
          hexadecatetValue = parseInt(String(givenValue), 16);
        }
        let [isValid, message] = Validator_1.Validator.isValidIPv6Hexadecatet(BigInt(hexadecatetValue));
        if (!isValid) {
          throw Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        this.value = hexadecatetValue;
      }
      /**
         * Returns the numeric value in base 10 (ie decimal)
         *
         * @returns {number} the numeric value in base 10 (ie decimal)
         */
      getValue() {
        return this.value;
      }
      /**
         * Returns the string representation of the base 16 representation of the value
         * @returns {string} the string representation of the base 16 representation of the value
         */
      // TODO pad with a zero if digit is less than 4
      toString() {
        return this.value.toString(16);
      }
    };
    exports.Hexadecatet = Hexadecatet;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Octet.js
var require_Octet = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Octet.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Octet = void 0;
    var Validator_1 = require_Validator();
    var Octet = class _Octet {
      /**
         * Convenience method for creating an Octet out of a string value representing the value of the octet
         *
         * @param {string} rawValue the octet value in string
         * @returns {Octet} the Octet instance
         */
      static fromString(rawValue) {
        return new _Octet(rawValue);
      }
      /**
         * Convenience method for creating an Octet out of a numeric value representing the value of the octet
         *
         * @param {number} rawValue the octet value in number
         * @returns {Octet} the Octet instance
         */
      static fromNumber(rawValue) {
        return new _Octet(rawValue);
      }
      /**
         * Constructor for creating an instance of an Octet.
         *
         * The constructor parameter given could either be a string or number.
         *
         * If a string, it is the string representation of the numeric value of the octet
         * If a number, it is the numeric representation of the value of the octet
         *
         * @param {string | number} givenValue value of the octet to be created.
         */
      constructor(givenValue) {
        let octetValue;
        if (typeof givenValue === "string") {
          octetValue = parseInt(givenValue);
        } else {
          octetValue = givenValue;
        }
        let [isValid, message] = Validator_1.Validator.isValidIPv4Octet(BigInt(octetValue));
        if (!isValid) {
          throw Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        this.value = octetValue;
      }
      /**
         * Method to get the numeric value of the octet
         *
         * @returns {number} the numeric value of the octet
         */
      getValue() {
        return this.value;
      }
      /**
         * Returns a decimal representation of the value of the octet in string
         *
         * @returns {string} a decimal representation of the value of the octet in string
         */
      toString() {
        return this.value.toString(10);
      }
    };
    exports.Octet = Octet;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Prefix.js
var require_Prefix = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/Prefix.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.IPv6Prefix = exports.IPv4Prefix = void 0;
    exports.isIPv4Prefix = isIPv4Prefix;
    var Validator_1 = require_Validator();
    var IPNumber_1 = require_IPNumber();
    var BinaryUtils_1 = require_BinaryUtils();
    var HexadecimalUtils_1 = require_HexadecimalUtils();
    var Hexadecatet_1 = require_Hexadecatet();
    var IPv4Prefix = class _IPv4Prefix {
      /**
         * Convenience method for constructing an instance of IPv4 prefix from a decimal number
         *
         * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
         * @returns {IPv4Prefix} the instance of an IPv4 prefix
         */
      static fromNumber(rawValue) {
        return new _IPv4Prefix(rawValue);
      }
      static fromRangeSize(rangeSize) {
        let prefixNumber = rangeSize === 1n ? 32 : 32 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV4_SIZE);
        return _IPv4Prefix.fromNumber(BigInt(prefixNumber));
      }
      /**
         * Constructor for an instance of IPv4 prefix from a decimal number
         *
         * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
         * @returns {IPv4Prefix} the instance of an IPv4 prefix
         */
      constructor(rawValue) {
        this.type = "IPv4";
        this.bitValue = 32n;
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(
          rawValue,
          "IPv4"
          /* IPNumType.IPv4 */
        );
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        this.value = rawValue;
      }
      /**
         * Gets the decimal value of the IPv4 prefix
         *
         * @returns {number} the decimal value of the IPv4 prefix
         */
      getValue() {
        return this.value;
      }
      /**
         * Gets the decimal value of the IPv4 prefix as string
         * @returns {string} The decimal value of the IPv4 prefix as string
         */
      toString() {
        return this.value.toString();
      }
      /**
         * Converts the IPv4 prefix to a {@link IPv4Mask}
         *
         * The IPv4 mask is the representation of the prefix in the dot-decimal notation
         *
         * @returns {IPv4Mask} the mask representation of the prefix
         */
      toMask() {
        let onBits = "1".repeat(Number(this.value));
        let offBits = "0".repeat(Number(32n - this.value));
        return IPNumber_1.IPv4Mask.fromDecimalDottedString(this.toDecimalNotation(`${onBits}${offBits}`));
      }
      /**
         * Returns the size (number of IP numbers) of range of this prefix
         *
         * @return {bigint} the size (number of IP numbers) of range of this prefix
         */
      toRangeSize() {
        return 1n << this.bitValue - this.getValue();
      }
      /**
         * Returns a prefix for when this prefix is merged
         * with another prefix of the same size
         */
      merge() {
        return new _IPv4Prefix(this.value - 1n);
      }
      /**
         * Returns a prefix for when this prefix is split
         * into two equal halves
         */
      split() {
        return new _IPv4Prefix(this.value + 1n);
      }
      toDecimalNotation(bits) {
        return `${(0, BinaryUtils_1.parseBinaryStringToBigInt)(bits.substr(0, 8))}.${(0, BinaryUtils_1.parseBinaryStringToBigInt)(bits.substr(8, 8))}.${(0, BinaryUtils_1.parseBinaryStringToBigInt)(bits.substr(16, 8))}.${(0, BinaryUtils_1.parseBinaryStringToBigInt)(bits.substr(24, 8))}`;
      }
    };
    exports.IPv4Prefix = IPv4Prefix;
    var IPv6Prefix = class _IPv6Prefix {
      /**
         * Convenience method for constructing an instance of IPv46 prefix from a decimal number
         *
         * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
         * @returns {IPv4Prefix} the instance of an IPv6 prefix
         */
      static fromNumber(rawValue) {
        return new _IPv6Prefix(rawValue);
      }
      static fromRangeSize(rangeSize) {
        let prefixNumber = rangeSize === 1n ? 128 : 128 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV6_SIZE);
        return _IPv6Prefix.fromNumber(BigInt(prefixNumber));
      }
      /**
         * Constructor for an instance of IPv6 prefix from a decimal number
         *
         * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
         * @returns {IPv4Prefix} the instance of an IPv6 prefix
         */
      constructor(rawValue) {
        this.type = "IPv6";
        this.bitValue = 128n;
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(
          rawValue,
          "IPv6"
          /* IPNumType.IPv6 */
        );
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        this.value = rawValue;
      }
      /**
         * Gets the decimal value of the IPv6 prefix
         *
         * @returns {number} the decimal value of the IPv6 prefix
         */
      getValue() {
        return this.value;
      }
      /**
         * Gets the decimal value of the IPv4 prefix as string
         * @returns {string} he decimal value of the IPv4 prefix as string
         */
      toString() {
        return this.value.toString();
      }
      /**
         * Converts the IPv6 prefix to a {@link IPv6Mask}
         *
         * The IPv6 mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
         *
         * @returns {IPv6Mask} the mask representation of the prefix
         */
      toMask() {
        let onBits = "1".repeat(Number(this.value));
        let offBits = "0".repeat(128 - Number(this.value));
        return IPNumber_1.IPv6Mask.fromHexadecatet(this.toHexadecatetNotation(`${onBits}${offBits}`));
      }
      /**
         * Returns the size (number of IP numbers) of range of this prefix
         *
         * @return {bigint} the size (number of IP numbers) of range of this prefix
         */
      toRangeSize() {
        return 1n << this.bitValue - this.getValue();
      }
      /**
         * Returns a prefix for when this prefix is merged
         * with another prefix of the same size
         */
      merge() {
        return new _IPv6Prefix(this.value - 1n);
      }
      /**
         * Returns a prefix for when this prefix is split
         * into two equal halves
         */
      split() {
        return new _IPv6Prefix(this.value + 1n);
      }
      toHexadecatetNotation(bits) {
        let binaryStrings = bits.match(/.{1,16}/g);
        let hexadecimalStrings = binaryStrings.map((binaryString) => {
          return Hexadecatet_1.Hexadecatet.fromString((0, HexadecimalUtils_1.binaryStringToHexadecimalString)(binaryString));
        });
        return hexadecimalStrings.map((value) => {
          return value.toString();
        }).join(":");
      }
    };
    exports.IPv6Prefix = IPv6Prefix;
    function rangeSizeToPrefix(rangeSize, rangeMaxSize) {
      let ipType = rangeMaxSize > Validator_1.Validator.IPV4_SIZE ? "IPv6" : "IPv4";
      if (rangeSize > rangeMaxSize || rangeSize === 0n) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeMessage.replace("$iptype", ipType));
      }
      try {
        return (0, BinaryUtils_1.intLog2)(rangeSize);
      } catch (e) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeForCidrMessage);
      }
    }
    function isIPv4Prefix(prefix) {
      return prefix.type === "IPv4";
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPRange.js
var require_IPRange = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPRange.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.IPv6CidrRange = exports.IPv4CidrRange = exports.AbstractIPRange = exports.RangedSet = void 0;
    exports.isIPv4CidrRange = isIPv4CidrRange;
    var IPNumber_1 = require_IPNumber();
    var Prefix_1 = require_Prefix();
    var BinaryUtils_1 = require_BinaryUtils();
    var Validator_1 = require_Validator();
    var RangedSet = class _RangedSet {
      /**
         * Convenience method for constructing an instance of {@link RangedSet} from a
         * single IP number.
         *
         * @param ip The IP number, either IPv4 or IPv6 to construct the range from.
         */
      static fromSingleIP(ip) {
        return new _RangedSet(ip, ip);
      }
      /**
         * Convenience method for constructing an instance of {@link RangedSet} from an
         * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
         *
         * @param cidrRange an instance of {@link RangedSet}
         */
      static fromCidrRange(cidrRange) {
        return new _RangedSet(cidrRange.getFirst(), cidrRange.getLast());
      }
      /**
         * Convenience method for constructing an instance of {@link RangedSet} from
         * a range string in the form of firstIp-lastIp
         *
         * @param rangeString  string in the form of firstIp-lastIp
         */
      static fromRangeString(rangeString) {
        let ips = rangeString.split("-").map((ip) => ip.trim());
        if (ips.length !== 2) {
          throw new Error("Argument should be in the format firstip-lastip");
        }
        let [firstIPString, lastIPString] = ips;
        let [isValidFirstIPv4] = Validator_1.Validator.isValidIPv4String(firstIPString);
        let [isValidSecondIPv4] = Validator_1.Validator.isValidIPv4String(lastIPString);
        let [isValidFirstIPv6] = Validator_1.Validator.isValidIPv6String(firstIPString);
        let [isValidLastIPv6] = Validator_1.Validator.isValidIPv6String(lastIPString);
        if (isValidFirstIPv4 && isValidSecondIPv4) {
          return new _RangedSet(IPNumber_1.IPv4.fromDecimalDottedString(firstIPString), IPNumber_1.IPv4.fromDecimalDottedString(lastIPString));
        } else if (isValidFirstIPv6 && isValidLastIPv6) {
          return new _RangedSet(IPNumber_1.IPv6.fromHexadecatet(firstIPString), IPNumber_1.IPv6.fromHexadecatet(lastIPString));
        } else {
          throw new Error("First IP and Last IP should be valid and same type");
        }
      }
      /**
         * Constructor for an instance of {@link RangedSet} from an
         * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
         *
         * Throws an exception if first IP number is not less than given last IP number
         *
         * @param first the first IP number of the range
         * @param last the last IP number of the range
         */
      constructor(first, last2) {
        this.first = first;
        this.last = last2;
        if (first.isGreaterThan(last2)) {
          throw new Error(`${first.toString()} should be lower than ${last2.toString()}`);
        }
        this.currentValue = first;
        this.bitValue = BigInt(first.bitSize);
      }
      /**
         * Returns the first IP number in the range
         */
      getFirst() {
        return this.first;
      }
      /**
         * Returns the last IP number in the range
         */
      getLast() {
        return this.last;
      }
      /**
         * Returns the size, which is the number of IP numbers in the range.
         */
      getSize() {
        return this.last.getValue() - this.first.getValue() + 1n;
      }
      /**
         * Converts to a string representation of the range in the form of:
         * <first-ip>-<last-ip>
         */
      toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
      }
      /**
         * Checks if this range is inside another range.
         *
         * @param otherRange the other range to check if this range is inside of.
         */
      inside(otherRange) {
        return otherRange.contains(this);
      }
      /**
         * Checks if this range contains the given other range.
         *
         * @param otherRange the other range to check if this range contains
         */
      contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast);
      }
      /**
         * Check if this range is equal to the given other range.
         *
         * @param otherRange the other range to check if equal to this range.
         */
      isEquals(otherRange) {
        return this.getFirst().isEquals(otherRange.getFirst()) && this.getLast().isEquals(otherRange.getLast());
      }
      /**
         * Check if this range is less than the given range.
         *
         * @param otherRange the other range to check if less than.
         */
      isLessThan(otherRange) {
        if (this.isEquals(otherRange)) {
          return false;
        } else {
          if (this.getFirst().isEquals(otherRange.getFirst())) {
            return this.getSize() < otherRange.getSize();
          }
          return this.getFirst().isLessThan(otherRange.getFirst());
        }
      }
      /**
         * Check if this range is greater than the given range.
         *
         * @param otherRange the other range to check if greater than.
         */
      isGreaterThan(otherRange) {
        if (this.isEquals(otherRange)) {
          return false;
        } else {
          if (this.getFirst().isEquals(otherRange.getFirst())) {
            return this.getSize() > otherRange.getSize();
          }
          return this.getFirst().isGreaterThan(otherRange.getFirst());
        }
      }
      /**
         * Checks of this range overlaps with a given other range.
         *
         * This means it checks if part of a range is part of another range without
         * being totally contained in the other range. Hence Equal or ranges contained inside one
         * another are not considered as overlapping.
         *
         * @param otherRange the other range to check if it overlaps with this range.
         */
      isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst) || otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(thisFirst) || this.contains(otherRange) || otherRange.contains(this);
      }
      /**
         * Check if this range can be converted to a CIDR range.
         */
      isCidrAble() {
        if (this.getSize() === 1n) {
          return true;
        }
        try {
          let prefix = (0, BinaryUtils_1.intLog2)(this.getSize());
          let netmask = (0, BinaryUtils_1.parseBinaryStringToBigInt)((0, BinaryUtils_1.cidrPrefixToMaskBinaryString)(
            prefix,
            (0, IPNumber_1.isIPv4)(this.currentValue) ? "IPv4" : "IPv6"
            /* IPNumType.IPv6 */
          ));
          return this.first.getValue() === (netmask & this.first.getValue());
        } catch (e) {
          return false;
        }
      }
      /**
         * Converts an instance of range to an instance of CIDR range
         */
      toCidrRange() {
        if ((0, IPNumber_1.isIPv4)(this.currentValue)) {
          return this.toIPv4CidrRange();
        } else {
          return this.toIPv6CidrRange();
        }
      }
      /**
         * Checks if this range is consecutive with another range.
         *
         * This means if the two ranges can be placed side by side, without any gap. Hence Equal
         * or ranges contained inside one another, or overlapping ranges are not considered as consecutive.
         *
         * @param otherRange the other range to check if this range is consecutive to.
         */
      isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst) || otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst);
      }
      /**
         * Creates a range that is a union of this range and the given other range.
         *
         * @param otherRange the other range to combine with this range
         */
      union(otherRange) {
        if (this.isEquals(otherRange)) {
          return new _RangedSet(otherRange.getFirst(), otherRange.getLast());
        }
        if (this.contains(otherRange)) {
          return new _RangedSet(this.getFirst(), this.getLast());
        } else if (otherRange.contains(this)) {
          return new _RangedSet(otherRange.getFirst(), otherRange.getLast());
        }
        if (this.isOverlapping(otherRange)) {
          if (this.getFirst().isLessThan(otherRange.getFirst())) {
            return new _RangedSet(this.getFirst(), otherRange.getLast());
          } else {
            return new _RangedSet(otherRange.getFirst(), this.getLast());
          }
        }
        throw new Error("Ranges do not overlap nor are equal");
      }
      /**
         * Prepends given range with this range.
         * The last IP in the given range should be adjacent to the first IP in this range
         *
         * @param otherRange the other range to prepend
         */
      prepend(otherRange) {
        if (otherRange.getLast().nextIPNumber().isEquals(this.getFirst())) {
          return new _RangedSet(otherRange.getFirst(), this.getLast());
        } else {
          throw new Error("Range to prepend must be adjacent");
        }
      }
      /**
         * Appends given range with this range.
         * The last IP in this range should be adjacent to the first IP in range to append
         *
         * @param otherRange the other range to append
         */
      append(otherRange) {
        if (this.getLast().nextIPNumber().isEquals(otherRange.getFirst())) {
          return new _RangedSet(this.getFirst(), otherRange.getLast());
        } else {
          throw new Error("Range to append must be adjacent");
        }
      }
      subtract(otherRange) {
        if (!this.isOverlapping(otherRange)) {
          throw new Error("Cannot subtract ranges that are not overlapping");
        }
        if (!this.isLessThan(otherRange)) {
          throw new Error("Cannot subtract a larger range from this range");
        }
        return new _RangedSet(this.getFirst(), otherRange.getLast());
      }
      /**
         * Returns a sub range of a given size from this range.
         *
         * @param offset offset from this range where the subrange should begin
         * @param size the size of the range
         */
      takeSubRange(offset, size) {
        if (offset + size > this.getSize()) {
          throw new RangeError("Requested range is greater than what can be taken");
        }
        if (size === 0n) {
          throw new Error("Sub range cannot be zero");
        }
        let valueOfFirstIp = this.getFirst().value + offset;
        let firstIp = (0, IPNumber_1.isIPv4)(this.getFirst()) ? IPNumber_1.IPv4.fromNumber(valueOfFirstIp) : IPNumber_1.IPv6.fromBigInt(valueOfFirstIp);
        let valueOfLastIp = firstIp.value + (size - 1n);
        let lastIp = (0, IPNumber_1.isIPv4)(firstIp) ? IPNumber_1.IPv4.fromNumber(valueOfLastIp) : IPNumber_1.IPv6.fromBigInt(valueOfLastIp);
        return new _RangedSet(firstIp, lastIp);
      }
      /**
         * Performs a subtraction operation, where the passed range is removed from the original range.
         *
         * The return range from the subtraction operation could be a single or multiple ranges
         *
         * @param range
         */
      difference(range) {
        if (range.getSize() > this.getSize()) {
          throw new Error("Range is greater than range to be subtracted from");
        }
        if (!this.contains(range)) {
          throw new Error("Range to subtract is not contained in this range");
        }
        let reminders = [];
        try {
          reminders.push(new _RangedSet(this.getFirst(), range.getFirst().previousIPNumber()));
        } catch (e) {
        }
        try {
          reminders.push(new _RangedSet(range.getLast().nextIPNumber(), this.getLast()));
        } catch (e) {
        }
        return reminders;
      }
      *take(count) {
        let computed = this.getFirst();
        let returnCount = count === void 0 ? this.getSize().valueOf() : count;
        while (returnCount > 0) {
          returnCount--;
          yield computed;
          computed = computed.nextIPNumber();
        }
      }
      *[Symbol.iterator]() {
        yield* this.take();
      }
      toIPv4CidrRange() {
        let candidateRange = new IPv4CidrRange(IPNumber_1.IPv4.fromNumber(this.getFirst().getValue()), Prefix_1.IPv4Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
          return candidateRange;
        } else {
          throw new Error("Range cannot be converted to CIDR");
        }
      }
      toIPv6CidrRange() {
        let candidateRange = new IPv6CidrRange(IPNumber_1.IPv6.fromBigInt(this.getFirst().getValue()), Prefix_1.IPv6Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
          return candidateRange;
        } else {
          throw new Error("Range cannot be converted to CIDR");
        }
      }
    };
    exports.RangedSet = RangedSet;
    var AbstractIPRange = class {
      hasNextRange() {
        let sizeOfCurrentRange = this.getSize();
        return 2n ** this.bitValue - sizeOfCurrentRange >= this.getFirst().getValue() + sizeOfCurrentRange;
      }
      hasPreviousRange() {
        return this.getSize() <= this.getFirst().getValue();
      }
      toRangeSet() {
        return new RangedSet(this.getFirst(), this.getLast());
      }
      inside(otherRange) {
        return this.toRangeSet().inside(otherRange.toRangeSet());
      }
      contains(otherRange) {
        if (otherRange instanceof IPNumber_1.AbstractIPNum) {
          const firstValue = this.getFirst().getValue();
          const lastValue = this.getLast().getValue();
          const otherValue = otherRange.getValue();
          return otherValue >= firstValue && otherValue <= lastValue;
        }
        return this.toRangeSet().contains(otherRange.toRangeSet());
      }
      toRangeString() {
        return this.toRangeSet().toRangeString();
      }
      isOverlapping(otherRange) {
        return this.toRangeSet().isOverlapping(otherRange.toRangeSet());
      }
      isConsecutive(otherRange) {
        return this.toRangeSet().isConsecutive(otherRange.toRangeSet());
      }
      isCidrMergeable(otherRange) {
        const count = BigInt((0, BinaryUtils_1.matchingBitCount)(this.getFirst().toBinaryString(), otherRange.getFirst().toBinaryString()));
        if (this.getPrefix().value - count !== 1n) {
          return false;
        }
        return this.isConsecutive(otherRange) && this.getSize() === otherRange.getSize();
      }
      isMergeable(otherRange) {
        return this.isCidrMergeable(otherRange) || this.contains(otherRange) || this.inside(otherRange);
      }
      isEquals(otherRange) {
        return this.toRangeSet().isEquals(otherRange.toRangeSet());
      }
      merge(otherRange) {
        if (!this.isCidrMergeable(otherRange)) {
          throw new Error(`Cannot merge. Ranges (${this.toRangeString()},${otherRange.toRangeString()}) are not consecutive and/or of same size`);
        }
        return this.newInstance(this.getFirst(), this.getPrefix().merge());
      }
      /**
         * Returns a lazily evaluated representation of the IP range that produces IP numbers by either:
         *
         * - iterating over using the for of syntax
         * - converting to array using spread syntax
         * - or assigning values to variables using deconstruction
         *
         * @param count the number of IP numbers to lazily evaluate.
         * If none is given, the whole IP range is lazily returned.
         */
      *takeStream(count) {
        return this.toRangeSet().take(count);
      }
      *[Symbol.iterator]() {
        yield* this.toRangeSet();
      }
    };
    exports.AbstractIPRange = AbstractIPRange;
    var IPv4CidrRange = class _IPv4CidrRange extends AbstractIPRange {
      /**
         * Convenience method for constructing an instance of an IPv4CidrRange from an IP range represented in CIDR notation
         *
         * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
         * @returns {IPv4CidrRange} the IPv4CidrRange
         */
      static fromCidr(rangeIncidrNotation) {
        let [isValid, errorMessages] = Validator_1.Validator.isValidIPv4CidrNotation(rangeIncidrNotation);
        if (!isValid) {
          let messages = errorMessages.filter((message) => {
            return message !== "";
          });
          throw new Error(messages.join(" and "));
        }
        let cidrComponents = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = BigInt(parseInt(cidrComponents[1]));
        return new _IPv4CidrRange(IPNumber_1.IPv4.fromDecimalDottedString(ipString), Prefix_1.IPv4Prefix.fromNumber(prefix));
      }
      /**
         * Constructor for creating an instance of an IPv4 range.
         *
         * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
         * number and the prefix.
         *
         * @param {IPv4} ipv4 the IP number used to construct the range. By convention this is the first IP number in
         * the range, but it could also be any IP number within the range
         * @param {IPv4Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
         * given IP number in other to create the range
         */
      constructor(ipv4, cidrPrefix) {
        super();
        this.ipv4 = ipv4;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = 32n;
      }
      /**
         * Gets the size of IPv4 numbers contained within the IPv4 range
         *
         * @returns {bigint} the amount of IPv4 numbers in the range
         */
      getSize() {
        return this.cidrPrefix.toRangeSize();
      }
      /**
         * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
         *
         * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
         * on the Classless Inter-Domain Routing notation
         *
         * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
         */
      toCidrString() {
        let first = this.ipv4.toString();
        return `${first.toString()}/${this.cidrPrefix.toString()}`;
      }
      /**
         * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
         * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
         *
         * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
         */
      toRangeString() {
        return super.toRangeString();
      }
      /**
         * Method that returns the first IPv4 number in the IPv4 range
         *
         * @returns {IPv4} the first IPv4 number in the IPv4 range
         */
      getFirst() {
        return IPNumber_1.IPv4.fromNumber(this.ipv4.getValue() & this.cidrPrefix.toMask().getValue());
      }
      /**
         * Method that returns the last IPv4 number in the IPv4 range
         *
         * @returns {IPv4} the last IPv4 number in the IPv4 range
         */
      getLast() {
        return last(this, this.ipv4);
      }
      newInstance(num, prefix) {
        return new _IPv4CidrRange(num, prefix);
      }
      getPrefix() {
        return this.cidrPrefix;
      }
      /**
         * Indicates whether the given IPv4 range is an adjacent range.
         *
         * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
         * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
         *
         * @param {IPv4CidrRange} otherRange the other IPv4 range to compare with
         * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
         */
      isConsecutive(otherRange) {
        return super.isConsecutive(otherRange);
      }
      /**
         * Indicates if the given IPv4 range is a subset.
         *
         * By a subset range, it means all the values of the given range are contained by this IPv4 range
         *
         * @param {IPv4CidrRange} otherRange the other IPv4 range
         * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
         */
      contains(otherRange) {
        return super.contains(otherRange);
      }
      /**
         * Indicate if the given range is a container range.
         *
         * By container range, it means all the IP number in this current range can be found within the given range.
         *
         * @param {IPv4CidrRange} otherRange he other IPv4 range
         * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
         */
      inside(otherRange) {
        return super.inside(otherRange);
      }
      /**
         * Checks if two IPv4 ranges overlap
         * @param {IPv4CidrRange} otherRange the other IPv4 range
         * @returns {boolean} true if the ranges overlap, false otherwise
         */
      isOverlapping(otherRange) {
        return super.isOverlapping(otherRange);
      }
      /**
         * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
         *
         * @param {bigint} count the amount of IPv4 number to take from the IPv4 range
         * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
         */
      take(count) {
        let ipv4s = [
          this.getFirst()
        ];
        let iteratingIPv4 = this.getFirst();
        if (count > this.getSize()) {
          let errMessage = Validator_1.Validator.takeOutOfRangeSizeMessage.replace("$count", count.toString()).replace("$size", this.getSize().toString());
          throw new Error(errMessage);
        }
        for (let counter = 0; counter < count - 1n; counter++) {
          ipv4s.push(iteratingIPv4.nextIPNumber());
          iteratingIPv4 = iteratingIPv4.nextIPNumber();
        }
        return ipv4s;
      }
      /**
         * Method that splits an IPv4 range into two halves
         *
         * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
         */
      split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32n) {
          throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv4Prefix.fromNumber(prefixToSplit + 1n);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new _IPv4CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new _IPv4CidrRange(firstIPOfSecondRange, splitCidr);
        return [
          firstRange,
          secondRange
        ];
      }
      /**
         * Method that split prefix into ranges of the given prefix,
         * throws an exception if the size of the given prefix is larger than target prefix
         *
         * @param prefix the prefix to use to split
         * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
         */
      splitInto(prefix) {
        let splitCount = prefix.getValue() - this.cidrPrefix.getValue();
        if (splitCount < 0) {
          throw new Error("Prefix to split into is larger than source prefix");
        } else if (splitCount === 0n) {
          return [
            new _IPv4CidrRange(this.getFirst(), prefix)
          ];
        } else if (splitCount === 1n) {
          return this.split();
        } else {
          let results = this.split();
          while (splitCount > 1) {
            results = results.flatMap((result) => result.split());
            splitCount = splitCount - 1n;
          }
          return results;
        }
      }
      /**
         * Returns true if there is an adjacent IPv4 cidr range of exactly the same size next to this range
         */
      hasNextRange() {
        return super.hasNextRange();
      }
      /**
         * Returns true if there is an adjacent IPv4 cidr range of exactly the same size previous to this range
         */
      hasPreviousRange() {
        return super.hasPreviousRange();
      }
      /**
         * Return the next IPv6 cidr range, or undefined if no next range
         */
      nextRange() {
        if (this.hasNextRange()) {
          let sizeOfCurrentRange = this.getSize();
          let startOfNextRange = this.getFirst().getValue() + sizeOfCurrentRange;
          return new _IPv4CidrRange(new IPNumber_1.IPv4(startOfNextRange), this.cidrPrefix);
        }
        return;
      }
      /**
         * Return the previous IPv6 cidr range, or undefined if no next range
         */
      previousRange() {
        if (this.hasPreviousRange()) {
          let sizeOfCurrentRange = this.getSize();
          let startOfPreviousRange = this.getFirst().getValue() - sizeOfCurrentRange;
          return new _IPv4CidrRange(new IPNumber_1.IPv4(startOfPreviousRange), this.cidrPrefix);
        }
        return;
      }
    };
    exports.IPv4CidrRange = IPv4CidrRange;
    var IPv6CidrRange = class _IPv6CidrRange extends AbstractIPRange {
      /**
         * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
         *
         * @param {string} rangeInCidrNotation the range of the IPv6 number in CIDR notation
         * @returns {IPv6CidrRange} the IPV6Range
         */
      static fromCidr(rangeInCidrNotation) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6CidrNotation(rangeInCidrNotation);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let cidrComponents = rangeInCidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = BigInt(parseInt(cidrComponents[1]));
        return new _IPv6CidrRange(IPNumber_1.IPv6.fromHexadecatet(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
      }
      /**
         * Constructor for creating an instance of an IPv6 range.
         *
         * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
         * number and the prefix.
         *
         * @param {IPv6} ipv6 the IP number used to construct the range. By convention this is the first IP number in
         * the range, but it could also be any IP number within the range
         * @param {IPv6Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
         * given IPv6 number in other to create the range
         */
      constructor(ipv6, cidrPrefix) {
        super();
        this.ipv6 = ipv6;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = 128n;
      }
      /**
         * Gets the size of IPv6 numbers contained within the IPv6 range
         *
         * @returns {bigint} the amount of IPv6 numbers in the range
         */
      getSize() {
        return this.cidrPrefix.toRangeSize();
      }
      /**
         * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
         *
         * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
         * on the Classless Inter-Domain Routing notation
         *
         * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
         */
      toCidrString() {
        let first = this.ipv6.toString();
        return `${first.toString()}/${this.cidrPrefix.toString()}`;
      }
      /**
         * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
         * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
         *
         * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
         */
      toRangeString() {
        return super.toRangeString();
      }
      /**
         * Method that returns the first IPv6 number in the IPv6 range
         *
         * @returns {IPv6} the first IPv6 number in the IPv6 range
         */
      getFirst() {
        return IPNumber_1.IPv6.fromBigInt(this.ipv6.getValue() & this.cidrPrefix.toMask().getValue());
      }
      /**
         * Method that returns the last IPv6 number in the IPv6 range
         *
         * @returns {IPv6} the last IPv6 number in the IPv6 range
         */
      getLast() {
        return last(this, this.ipv6);
      }
      newInstance(num, prefix) {
        return new _IPv6CidrRange(num, prefix);
      }
      getPrefix() {
        return this.cidrPrefix;
      }
      /**
         * Indicates whether the given IPv6 range is an adjacent range.
         *
         * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
         * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
         *
         * @param {IPv6CidrRange} otherRange the other IPv6 range to compare with
         * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
         */
      isConsecutive(otherRange) {
        return super.isConsecutive(otherRange);
      }
      /**
         * Indicates if the given IPv6 range is a subset.
         *
         * By a subset range, it means all the values of the given range are contained by this IPv6 range
         *
         * @param {IPv6CidrRange} otherRange the other IPv6 range
         * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
         */
      contains(otherRange) {
        return super.contains(otherRange);
      }
      /**
         * Indicate if the given range is a container range.
         *
         * By container range, it means all the IP number in this current range can be found within the given range.
         *
         * @param {IPv6CidrRange} otherRange he other IPv6 range
         * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
         */
      inside(otherRange) {
        return super.inside(otherRange);
      }
      /**
         * Checks if two IPv6 ranges overlap
         * @param {IPv6CidrRange} otherRange the other IPv6 range
         * @returns {boolean} true if the ranges overlap, false otherwise
         */
      isOverlapping(otherRange) {
        return super.isOverlapping(otherRange);
      }
      /**
         * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
         *
         * @param {bigint} count the amount of IPv6 number to take from the IPv6 range
         * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
         */
      take(count) {
        let iPv6s = [
          this.getFirst()
        ];
        let iteratingIPv6 = this.getFirst();
        if (count > this.getSize()) {
          throw new Error(`${count.toString()} is greater than ${this.getSize().toString()}, the size of the range`);
        }
        for (var counter = 0; counter < count - 1n; counter++) {
          iPv6s.push(iteratingIPv6.nextIPNumber());
          iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
      }
      /**
         * Method that splits an IPv6 cidr range into two halves
         *
         * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
         */
      split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128n) {
          throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv6Prefix.fromNumber(prefixToSplit + 1n);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new _IPv6CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new _IPv6CidrRange(firstIPOfSecondRange, splitCidr);
        return [
          firstRange,
          secondRange
        ];
      }
      /**
         * Method that split prefix into ranges of the given prefix,
         * throws an exception if the size of the given prefix is larger than target prefix
         *
         * @param prefix the prefix to use to split
         * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
         */
      splitInto(prefix) {
        let splitCount = prefix.getValue() - this.cidrPrefix.getValue();
        if (splitCount < 0) {
          throw new Error("Prefix to split into is larger than source prefix");
        } else if (splitCount === 0n) {
          return [
            new _IPv6CidrRange(this.getFirst(), prefix)
          ];
        } else if (splitCount === 1n) {
          return this.split();
        } else {
          let results = this.split();
          while (splitCount > 1) {
            results = results.flatMap((result) => result.split());
            splitCount = splitCount - 1n;
          }
          return results;
        }
      }
      /**
         * Returns true if there is an adjacent IPv6 cidr range of exactly the same size next to this range
         */
      hasNextRange() {
        return super.hasNextRange();
      }
      /**
         * Returns true if there is an adjacent IPv6 cidr range of exactly the same size previous to this range
         */
      hasPreviousRange() {
        return super.hasPreviousRange();
      }
      /**
         * Return the next IPv6 cidr range, or undefined if no next range
         */
      nextRange() {
        if (this.hasNextRange()) {
          let sizeOfCurrentRange = this.getSize();
          let startOfNextRange = this.getFirst().getValue() + sizeOfCurrentRange;
          return new _IPv6CidrRange(new IPNumber_1.IPv6(startOfNextRange, this.ipv6.zoneId), this.cidrPrefix);
        }
        return;
      }
      /**
         * Return the previous IPv6 cidr range, or undefined if no next range
         */
      previousRange() {
        if (this.hasPreviousRange()) {
          let sizeOfCurrentRange = this.getSize();
          let startOfPreviousRange = this.getFirst().getValue() - sizeOfCurrentRange;
          return new _IPv6CidrRange(new IPNumber_1.IPv6(startOfPreviousRange, this.ipv6.zoneId), this.cidrPrefix);
        }
        return;
      }
    };
    exports.IPv6CidrRange = IPv6CidrRange;
    var last = (range, ip) => {
      let bitValue = Number(range.bitValue.valueOf());
      let maskSize = BigInt(`0b${"1".repeat(bitValue)}`);
      let maskAsBigInteger = range.cidrPrefix.toMask().getValue();
      let invertedMask = (0, BinaryUtils_1.leftPadWithZeroBit)((maskAsBigInteger ^ maskSize).toString(2), bitValue);
      if (isIPv4CidrRange(range)) {
        return IPNumber_1.IPv4.fromNumber(ip.getValue() | (0, BinaryUtils_1.parseBinaryStringToBigInt)(invertedMask));
      } else {
        return IPNumber_1.IPv6.fromBigInt(ip.getValue() | (0, BinaryUtils_1.parseBinaryStringToBigInt)(invertedMask));
      }
    };
    function isIPv4CidrRange(ip) {
      return ip.bitValue.valueOf() === 32n;
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPNumber.js
var require_IPNumber = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.IPv6Mask = exports.IPv4Mask = exports.IPv6 = exports.Asn = exports.IPv4 = exports.AbstractIPNum = void 0;
    exports.isIPv4 = isIPv4;
    var Octet_1 = require_Octet();
    var Validator_1 = require_Validator();
    var BinaryUtils_1 = require_BinaryUtils();
    var BinaryUtils_2 = require_BinaryUtils();
    var BinaryUtils_3 = require_BinaryUtils();
    var BinaryUtils_4 = require_BinaryUtils();
    var Hexadecatet_1 = require_Hexadecatet();
    var HexadecimalUtils_1 = require_HexadecimalUtils();
    var IPv6Utils_1 = require_IPv6Utils();
    var HexadecimalUtils_2 = require_HexadecimalUtils();
    var IPRange_1 = require_IPRange();
    var IPRange_2 = require_IPRange();
    var AbstractIPNum = class {
      /**
         * Gets the numeric value of an IP number as {@link BigInt}
         *
         * @returns bigInt the numeric value of an IP number.
         */
      getValue() {
        return this.value;
      }
      /**
         * Gets the binary string representation of an IP number.
         *
         * @returns {string} the string binary representation.
         */
      toBinaryString() {
        return (0, BinaryUtils_3.leftPadWithZeroBit)(this.value.toString(2), this.bitSize);
      }
      /**
         * Checks if an IP number has a value greater than the present value
         * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
         */
      hasNext() {
        return this.value < this.maximumBitSize;
      }
      /**
         * Checks if an IP number has a value lesser than the present value
         * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
         */
      hasPrevious() {
        return this.value > 0n;
      }
      /**
         * Checks if the given IP number, is equals to the current IP number
         *
         * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
         * @returns {boolean} true if the given IP number is equals
         */
      isEquals(anotherIPNum) {
        return this.value === anotherIPNum.value;
      }
      /**
         * Checks if the given IP number is lesser than this current IP number
         *
         * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
         * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
         */
      isLessThan(anotherIPNum) {
        return this.value < anotherIPNum.value;
      }
      /**
         * Checks if the given IP number is greater than this current IP number
         *
         * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
         * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
         */
      isGreaterThan(anotherIPNum) {
        return this.value > anotherIPNum.value;
      }
      /**
         * Checks if the given IP number is less than or equals to this current IP number
         *
         * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
         * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
         */
      isLessThanOrEquals(anotherIPNum) {
        return this.value <= anotherIPNum.value;
      }
      /**
         * Checks if the given IP number is greater than or equals to this current IP number
         *
         * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
         * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
         * otherwise.
         */
      isGreaterThanOrEquals(anotherIPNum) {
        return this.value >= anotherIPNum.value;
      }
    };
    exports.AbstractIPNum = AbstractIPNum;
    var IPv43 = class _IPv4 extends AbstractIPNum {
      /**
         * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInt
         *
         * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
         * @returns {IPv4} the IPv4 instance
         */
      static fromNumber(bigIntValue) {
        return new _IPv4(bigIntValue);
      }
      /**
         * A convenience method for creating an {@link IPv4} by providing the IP number in dot-decimal notation. E.g
         * "10.1.1.10"
         *
         * {@see https://en.wikipedia.org/wiki/Dot-decimal_notation} for more information on dot-decimal notation.
         *
         * @param {string} ipString the IP number in dot-decimal notation
         * @returns {IPv4} the IPv4 instance
         */
      static fromDecimalDottedString(ipString) {
        return new _IPv4(ipString);
      }
      /**
         * Alias for IPv4.fromDecimalDottedString.
         *
         * @param {string} ipString the IP number in dot-decimal notation
         * @returns {IPv4} the IPv4 instance
         */
      static fromString(ipString) {
        return _IPv4.fromDecimalDottedString(ipString);
      }
      /**
         * A convenience method for creating an {@link IPv4} from binary string
         *
         * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
         * @returns {IPv4} the IPv4 instance
         */
      static fromBinaryString(ipBinaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
          return new _IPv4((0, BinaryUtils_2.parseBinaryStringToBigInt)(ipBinaryString));
        } else {
          throw Error(validationResult[1].join(","));
        }
      }
      /**
         * Constructor for an IPv4 number.
         *
         * @param {string | bigint} ipValue value to construct an IPv4 from. The given value can either be
         * numeric or string. If a string is given then it needs to be in dot-decimal notation
         */
      constructor(ipValue) {
        super();
        this.bitSize = 32;
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        this.type = "IPv4";
        this.octets = [];
        this.separator = ".";
        if (typeof ipValue === "string") {
          let [value, octets] = this.constructFromDecimalDottedString(ipValue);
          this.value = value;
          this.octets = octets;
        } else {
          let [value, octets] = this.constructFromBigIntValue(ipValue);
          this.value = value;
          this.octets = octets;
        }
      }
      /**
         * A string representation of the IPv4 number. The string representation is in dot-decimal notation
         *
         * @returns {string} The string representation in dot-decimal notation
         */
      toString() {
        return this.octets.map((value) => {
          return value.toString();
        }).join(this.separator);
      }
      /**
         * Gets the individual {@link Octet} that makes up the IPv4 number
         *
         * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
         */
      getOctets() {
        return this.octets;
      }
      /**
         * Returns the next IPv4 number
         *
         * @returns {IPv4} the next IPv4 number
         */
      nextIPNumber() {
        return _IPv4.fromNumber(this.getValue() + 1n);
      }
      /**
         * Returns the previous IPv4 number
         *
         * @returns {IPv4} the previous IPv4 number
         */
      previousIPNumber() {
        return _IPv4.fromNumber(this.getValue() - 1n);
      }
      /**
         * Checks if this IPv4 address is a private address according to RFC 1918.
         *
         * Private IPv4 address ranges:
         * - 10.0.0.0/8 (10.0.0.0 to 10.255.255.255)
         * - 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
         * - 192.168.0.0/16 (192.168.0.0 to 192.168.255.255)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc1918
         * @returns {boolean} true if this IPv4 address is private, false otherwise
         */
      isPrivate() {
        return _IPv4.PRIVATE_RANGES.some((range) => range.contains(this));
      }
      /**
         * Checks if this IPv4 address is a documentation address according to RFC 5737.
         *
         * Documentation IPv4 address ranges:
         * - 192.0.2.0/24 (TEST-NET-1)
         * - 198.51.100.0/24 (TEST-NET-2)
         * - 203.0.113.0/24 (TEST-NET-3)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc5737
         * @returns {boolean} true if this IPv4 address is reserved for documentation, false otherwise
         */
      isDocumentation() {
        return _IPv4.DOCUMENTATION_RANGES.some((range) => range.contains(this));
      }
      /**
         * Checks if this IPv4 address is a multicast address according to RFC 1112.
         *
         * Multicast IPv4 address range:
         * - 224.0.0.0/4 (224.0.0.0 to 239.255.255.255)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc1112
         * @returns {boolean} true if this IPv4 address is multicast, false otherwise
         */
      isMulticast() {
        return _IPv4.MULTICAST_RANGE.contains(this);
      }
      /**
         * Checks if this IPv4 address is a broadcast address.
         *
         * When called without arguments, checks for the limited broadcast address (255.255.255.255).
         * When a subnet is provided, checks if this address is the directed broadcast for that subnet.
         *
         * @param subnet Optional CIDR range to check for directed broadcast
         * @returns {boolean} true if this is a broadcast address, false otherwise
         */
      isBroadcast(subnet) {
        if (subnet) {
          return this.isEquals(subnet.getLast());
        }
        return this.isEquals(_IPv4.LIMITED_BROADCAST);
      }
      /**
         * Checks if this IPv4 address is a loopback address according to RFC 5735.
         *
         * Loopback IPv4 address range:
         * - 127.0.0.0/8 (127.0.0.0 to 127.255.255.255)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc5735
         * @returns {boolean} true if this IPv4 address is loopback, false otherwise
         */
      isLoopback() {
        return _IPv4.LOOPBACK_RANGE.contains(this);
      }
      /**
         * Checks if this IPv4 address is an unspecified address according to RFC 6890.
         *
         * Unspecified IPv4 address:
         * - 0.0.0.0/32 (all zeros)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc6890
         * @returns {boolean} true if this IPv4 address is unspecified, false otherwise
         */
      isUnspecified() {
        return this.value === 0n;
      }
      /**
         * Checks if this IPv4 address is a link-local address according to RFC 6890.
         *
         * Link-local IPv4 address range:
         * - 169.254.0.0/16 (169.254.0.0 to 169.254.255.255)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc6890
         * @returns {boolean} true if this IPv4 address is link-local, false otherwise
         */
      isLinkLocal() {
        return _IPv4.LINK_LOCAL_RANGE.contains(this);
      }
      /**
         * Checks if this IPv4 address is a global unicast address.
         *
         * Global unicast is defined here as "everything else" - any address that does not
         * match the other specific address types (Unspecified, Loopback, Private, Link-Local,
         * Documentation, Multicast, Reserved, or Broadcast).
         *
         * Note that this is not a strict "publicly routable" check: it does not consult the
         * full IANA special-purpose address registry (RFC 6890), so special-purpose ranges
         * not covered by the checks above - such as shared address space 100.64.0.0/10
         * (RFC 6598) and benchmarking space 198.18.0.0/15 (RFC 2544) - still return true.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc6890
         * @returns {boolean} true if this IPv4 address is global unicast, false otherwise
         */
      isGlobalUnicast() {
        return !this.isUnspecified() && !this.isLoopback() && !this.isPrivate() && !this.isLinkLocal() && !this.isDocumentation() && !this.isMulticast() && !this.isReserved() && !this.isBroadcast();
      }
      /**
         * Checks if this IPv4 address is in a reserved range according to RFC 6890.
         *
         * Reserved IPv4 address range:
         * - 240.0.0.0/4 (240.0.0.0 to 255.255.255.254)
         *
         * Note: 255.255.255.255 is the limited broadcast address, not reserved.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc6890
         * @returns {boolean} true if this IPv4 address is reserved, false otherwise
         */
      isReserved() {
        const reservedStart = _IPv4.fromDecimalDottedString("240.0.0.0").value;
        const reservedEnd = _IPv4.fromDecimalDottedString("255.255.255.254").value;
        return this.value >= reservedStart && this.value <= reservedEnd;
      }
      /**
         * Returns this IPv4 number as a IPv4-Mapped IPv6 Address
         *
         * The IPv4-Mapped IPv6 Address allows an IPv4 number to be embedded within an IPv6 number
         *
         * {@see https://tools.ietf.org/html/rfc4291#section-2.5.5} for more information on the IPv4-Mapped IPv6 Address
         *
         * @returns {IPv6} an IPv6 number with the IPv4 embedded within it
         */
      toIPv4MappedIPv6() {
        let binary = "1".repeat(16) + this.toBinaryString();
        return IPv6.fromBinaryString(binary);
      }
      constructFromDecimalDottedString(ipString) {
        let octets;
        let value;
        let [isValid, message] = Validator_1.Validator.isValidIPv4String(ipString);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let stringOctets = ipString.split(".");
        octets = stringOctets.map((rawOctet) => {
          return Octet_1.Octet.fromString(rawOctet);
        });
        value = BigInt(`0b${(0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(ipString)}`);
        return [
          value,
          octets
        ];
      }
      constructFromBigIntValue(ipv4Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let binaryString = (0, BinaryUtils_4.numberToBinaryString)(ipv4Number);
        ipv4Number = typeof ipv4Number === "bigint" ? ipv4Number : BigInt(ipv4Number);
        return [
          ipv4Number,
          this.binaryStringToDecimalOctets(binaryString)
        ];
      }
      binaryStringToDecimalOctets(ipv4BinaryString) {
        if (ipv4BinaryString.length < 32) {
          ipv4BinaryString = (0, BinaryUtils_3.leftPadWithZeroBit)(ipv4BinaryString, 32);
        }
        let octets = ipv4BinaryString.match(/.{1,8}/g);
        return octets.map((octet) => {
          return Octet_1.Octet.fromString((0, BinaryUtils_2.parseBinaryStringToBigInt)(octet).toString());
        });
      }
    };
    exports.IPv4 = IPv43;
    IPv43.PRIVATE_RANGES = [
      IPRange_1.IPv4CidrRange.fromCidr("10.0.0.0/8"),
      IPRange_1.IPv4CidrRange.fromCidr("172.16.0.0/12"),
      IPRange_1.IPv4CidrRange.fromCidr("192.168.0.0/16")
    ];
    IPv43.DOCUMENTATION_RANGES = [
      IPRange_1.IPv4CidrRange.fromCidr("192.0.2.0/24"),
      IPRange_1.IPv4CidrRange.fromCidr("198.51.100.0/24"),
      IPRange_1.IPv4CidrRange.fromCidr("203.0.113.0/24")
    ];
    IPv43.MULTICAST_RANGE = IPRange_1.IPv4CidrRange.fromCidr("224.0.0.0/4");
    IPv43.LOOPBACK_RANGE = IPRange_1.IPv4CidrRange.fromCidr("127.0.0.0/8");
    IPv43.LINK_LOCAL_RANGE = IPRange_1.IPv4CidrRange.fromCidr("169.254.0.0/16");
    IPv43.LIMITED_BROADCAST = IPv43.fromDecimalDottedString("255.255.255.255");
    var Asn = class _Asn extends AbstractIPNum {
      /**
         * A convenience method for creating an instance of {@link Asn} from a string
         *
         * The given string can be in asplain, asdot or asdot+ representation format.
         * {@see https://tools.ietf.org/html/rfc5396} for more information on
         * the different ASN string representation
         *
         * @param {string} rawValue the asn string. In either asplain, asdot or asdot+ format
         * @returns {Asn} the constructed ASN instance
         */
      static fromString(rawValue) {
        return new _Asn(rawValue);
      }
      /**
         * A convenience method for creating an instance of {@link Asn} from a numeric value
         *
         * @param {number} rawValue the asn numeric value
         * @returns {Asn} the constructed ASN instance
         */
      static fromNumber(rawValue) {
        return new _Asn(rawValue);
      }
      /**
         * A convenience method for creating an instance of {@link Asn} from a binary string
         *
         * @param {string} binaryString to create an ASN instance from
         * @returns {Asn} the constructed ASN instance
         */
      static fromBinaryString(binaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(binaryString);
        if (validationResult[0]) {
          return new _Asn(parseInt(binaryString, 2));
        } else {
          throw Error(validationResult[1].join(","));
        }
      }
      /**
         * Constructor for an instance of {@link ASN}
         *
         * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
         * string. If in string then it can be in asplain, asdot or asdot+ string representation format
         */
      constructor(rawValue) {
        super();
        this.bitSize = 32;
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        this.type = "ASN";
        if (typeof rawValue === "string") {
          if (_Asn.startWithASPrefix(rawValue)) {
            this.value = BigInt(parseInt(rawValue.substring(2)));
          } else if (rawValue.indexOf(".") != -1) {
            this.value = BigInt(this.parseFromDotNotation(rawValue));
          } else {
            this.value = BigInt(parseInt(rawValue));
          }
        } else {
          let valueAsBigInt = BigInt(rawValue);
          let [isValid, message] = Validator_1.Validator.isValidAsnNumber(valueAsBigInt);
          if (!isValid) {
            throw Error(message.filter((msg) => {
              return msg !== "";
            }).toString());
          }
          this.value = valueAsBigInt;
        }
      }
      /**
         * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
         *
         * @returns {string} A string representation where the asn value is prefixed by "ASN"
         */
      toString() {
        let stringValue = this.value.toString();
        return `${_Asn.AS_PREFIX}${stringValue}`;
      }
      /**
         * A string representation where the ASN numeric value of is represented as a string. For example "65526"
         *
         * @returns {string} A string representation where the ASN numeric value of is represented as a string
         */
      toASPlain() {
        return this.value.toString();
      }
      /**
         * A string representation where the ASN value is represented using the asplain notation if the ASN value is
         * less than 65536 and uses asdot+ notation when the value is greater than 65536.
         *
         * For example 65526 will be represented as "65526" while 65546 will be represented as "1.10"
         *
         *
         * @returns {string} A string representation of the ASN in either asplain or asdot+ notation depending on
         * whether the numeric value of the ASN number is greater than 65526 or not.
         */
      toASDot() {
        if (this.value.valueOf() >= 65536n) {
          return this.toASDotPlus();
        }
        return this.toASPlain();
      }
      /**
         * A string representation where the ASN value is represented using the asdot+ notation
         *
         * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
         *
         */
      toASDotPlus() {
        let high = this.value.valueOf() / 65536n;
        let low = this.value.valueOf() % 65536n;
        return `${high}.${low}`;
      }
      /**
         * Converts the ASN value to binary numbers represented with strings
         *
         * @returns {string} a binary string representation of the value of the ASN number
         */
      toBinaryString() {
        return (0, BinaryUtils_4.numberToBinaryString)(this.value);
      }
      /**
         * Checks if the ASN value is 16bit
         *
         * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
         */
      is16Bit() {
        let [valid16BitAsnNumber] = Validator_1.Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
      }
      /**
         * Checks if the ASN value is 32bit
         *
         * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
         */
      is32Bit() {
        return !this.is16Bit();
      }
      /**
         * Returns the next ASN number
         *
         * @returns {AbstractIPNum} the next ASN number
         */
      nextIPNumber() {
        return new _Asn(this.value.valueOf() + 1n);
      }
      /**
         * Returns the previous ASN number
         *
         * @returns {AbstractIPNum} the previous ASN number
         */
      previousIPNumber() {
        return new _Asn(this.value.valueOf() - 1n);
      }
      /**
         * Checks if this ASN is a multicast address.
         *
         * ASNs are not IP addresses, so this always returns false.
         *
         * @returns {boolean} always returns false for ASN
         */
      isMulticast() {
        return false;
      }
      /**
         * Checks if this ASN is a private address.
         *
         * ASNs are not IP addresses, so this always returns false.
         *
         * @returns {boolean} always returns false for ASN
         */
      isPrivate() {
        return false;
      }
      static startWithASPrefix(word) {
        return word.indexOf(_Asn.AS_PREFIX) === 0;
      }
      parseFromDotNotation(rawValue) {
        let values = rawValue.split(".");
        let high = parseInt(values[0]);
        let low = parseInt(values[1]);
        return high * 65535 + (low + high);
      }
    };
    exports.Asn = Asn;
    Asn.AS_PREFIX = "AS";
    var IPv6 = class _IPv6 extends AbstractIPNum {
      /**
         * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInt
         *
         * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
         * @returns {IPv6} the IPv6 instance
         */
      static fromBigInt(bigIntValue) {
        return new _IPv6(bigIntValue);
      }
      /**
         * A convenience method for creating an {@link IPv6} by providing the IP number in hexadecatet notation. E.g
         * "2001:800:0:0:0:0:0:2002"
         *
         * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more information on hexadecatet notation.
         *
         * @param {string} ipString the IP number in hexadecatet
         * @returns {IPv6} the IPv6 instance
         */
      static fromHexadecatet(ipString) {
        return new _IPv6(ipString);
      }
      /**
         * Alias for IPv6.fromHexadecimalString
         *
         * @param {string} ipString the IP number in hexadecatet
         * @returns {IPv6} the IPv6 instance
         */
      static fromString(ipString) {
        return _IPv6.fromHexadecatet(ipString);
      }
      /**
         * A convenience method for creating an {@link IPv6} from binary string
         *
         * @param {string} ipBinaryString the binary string representing the IPv6 number to be created
         * @returns {IPv6} the IPv6 instance
         */
      static fromBinaryString(ipBinaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
          let paddedBinaryString = (0, BinaryUtils_3.leftPadWithZeroBit)(ipBinaryString, 128);
          return new _IPv6((0, BinaryUtils_2.parseBinaryStringToBigInt)(paddedBinaryString));
        } else {
          throw Error(validationResult[1].join(","));
        }
      }
      /**
         * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from an instance of {@link IPv4}
         *
         * @param {IPv4} ipv4 to create an IPv4-Compatible {@link IPv6} Address
         * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
         */
      static fromIPv4(ipv4) {
        return ipv4.toIPv4MappedIPv6();
      }
      /**
         * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from a IPv4 represented in
         * dot-decimal notation i.e. 127.0.0.1
         *
         * @param {IPv4} ip4DotDecimalString string represented in a dot decimal string
         * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
         */
      static fromIPv4DotDecimalString(ip4DotDecimalString) {
        return new IPv43(ip4DotDecimalString).toIPv4MappedIPv6();
      }
      /**
         * Constructor for an IPv6 number.
         *
         * @param {string | bigint} ipValue value to construct an IPv6 from. The given value can either be
         * numeric or string. If a string is given then it needs to be in hexadecatet string notation
         */
      constructor(ipValue, zoneId) {
        super();
        this.bitSize = 128;
        this.maximumBitSize = Validator_1.Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
        this.type = "IPv6";
        this.hexadecatet = [];
        this.separator = ":";
        if (typeof ipValue === "string") {
          let [isValid, message] = Validator_1.Validator.isValidIPv6String(ipValue);
          if (!isValid) {
            throw new Error(message.filter((msg) => {
              return msg !== "";
            }).toString());
          }
          let [ipv6, zId] = ipValue.split("%");
          this.zoneId = zId ? zId : zoneId;
          let expandedIPv6 = (0, IPv6Utils_1.expandIPv6Number)(ipv6);
          let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
          this.value = value;
          this.hexadecatet = hexadecatet;
        } else {
          let [value, hexadecatet] = this.constructFromBigIntValue(ipValue);
          this.value = value;
          this.hexadecatet = hexadecatet;
          this.zoneId = zoneId;
        }
      }
      /**
         * A string representation of the IPv6 number.
         *
         * @returns {string} The string representation of IPv6
         */
      toString() {
        let ipv6String = this.hexadecatet.map((v) => v.toString()).join(":");
        if (this.hexadecatet.length < 8) {
          ipv6String = `::${ipv6String}`;
        }
        if (this.zoneId) {
          ipv6String = `${(0, IPv6Utils_1.collapseIPv6Number)(ipv6String)}%${this.zoneId}`;
        }
        return ipv6String;
      }
      /**
         * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
         *
         * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
         */
      //TODO maybe rename to something like getSegments? so it can be same with getOctet
      getHexadecatet() {
        return this.hexadecatet;
      }
      /**
         * Returns the next IPv6 number
         *
         * @returns {IPv6} the next IPv6 number
         */
      nextIPNumber() {
        return _IPv6.fromBigInt(this.getValue() + 1n);
      }
      /**
         * Returns the previous IPv6 number
         *
         * @returns {IPv6} the previous IPv6 number
         */
      previousIPNumber() {
        return _IPv6.fromBigInt(this.getValue() - 1n);
      }
      /**
         * Checks if this IPv6 address is a private address according to RFC 4193.
         *
         * Private IPv6 address range:
         * - fc00::/7 (Unique Local Addresses)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4193
         * @returns {boolean} true if this IPv6 address is private, false otherwise
         */
      isPrivate() {
        return _IPv6.PRIVATE_RANGE.contains(this);
      }
      /**
         * Checks if this IPv6 address is a documentation address according to RFC 3849 and RFC 9637.
         *
         * Documentation IPv6 address ranges:
         * - 2001:db8::/32 (RFC 3849)
         * - 3fff::/20 (RFC 9637)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc3849
         * @see https://datatracker.ietf.org/doc/html/rfc9637
         * @returns {boolean} true if this IPv6 address is reserved for documentation, false otherwise
         */
      isDocumentation() {
        return _IPv6.DOCUMENTATION_RANGES.some((range) => range.contains(this));
      }
      /**
         * Checks if this IPv6 address is a multicast address.
         *
         * Multicast IPv6 address range:
         * - ff00::/8 (ff00:: to ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is multicast, false otherwise
         */
      isMulticast() {
        return _IPv6.MULTICAST_RANGE.contains(this);
      }
      /**
         * Checks if this IPv6 multicast address has an embedded Rendezvous Point (RP).
         *
         * For an embedded RP to be present, the R, P, and T flags must all be set to 1.
         * The R flag (bit 9) indicates RP embedded, P flag (bit 10) indicates prefix-based,
         * and T flag (bit 11) indicates transient address.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc3956
         * @returns {boolean} true if embedded RP is present (R, P, T flags all set), false otherwise
         * @throws {Error} if this is not a multicast address
         */
      hasEmbeddedRP() {
        if (!this.isMulticast()) {
          throw new Error("Embedded RP can only be checked for multicast addresses");
        }
        const secondOctet = Number(this.value >> 112n & 0xffn);
        return (secondOctet & 112) === 112;
      }
      /**
         * Checks if this IPv6 address is an unspecified address according to RFC 4291.
         *
         * Unspecified IPv6 address:
         * - ::/128 (all zeros)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is unspecified, false otherwise
         */
      isUnspecified() {
        return this.value === 0n;
      }
      /**
         * Checks if this IPv6 address is a loopback address according to RFC 4291.
         *
         * Loopback IPv6 address:
         * - ::1/128
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is loopback, false otherwise
         */
      isLoopback() {
        return this.value === 1n;
      }
      /**
         * Checks if this IPv6 address is a link-local address according to RFC 4291.
         *
         * Link-local IPv6 address range:
         * - fe80::/10 (fe80:: to febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is link-local, false otherwise
         */
      isLinkLocal() {
        return _IPv6.LINK_LOCAL_RANGE.contains(this);
      }
      /**
         * Checks if this IPv6 address is a global unicast address according to RFC 4291.
         *
         * According to RFC 4291, global unicast addresses are defined as "everything else" -
         * any address that does not match the other specific address types (Unspecified,
         * Loopback, Multicast, Link-Local, IPv4-Mapped, Discard-Only, Documentation, or Private).
         *
         * Note that this is not a strict "publicly routable" check: it does not consult the
         * full IANA special-purpose address registry, so special-purpose ranges not covered
         * by the checks above still return true.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is global unicast, false otherwise
         */
      isGlobalUnicast() {
        return !this.isUnspecified() && !this.isLoopback() && !this.isMulticast() && !this.isLinkLocal() && !this.isIPv4Mapped() && !this.isDiscardOnly() && !this.isDocumentation() && !this.isPrivate();
      }
      /**
         * Checks if this IPv6 address is an IPv4-mapped IPv6 address according to RFC 4291.
         *
         * IPv4-mapped IPv6 addresses have a specific format:
         * - First 80 bits: all zeros
         * - Next 16 bits: 0xffff
         * - Last 32 bits: IPv4 address
         *
         * This corresponds to the format ::ffff:x.x.x.x where x.x.x.x is an IPv4 address.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {boolean} true if this IPv6 address is IPv4-mapped, false otherwise
         */
      isIPv4Mapped() {
        return this.value >> 32n === 0xffffn;
      }
      /**
         * Checks if this IPv6 address is a discard-only address according to RFC 6666.
         *
         * Discard-only IPv6 address range:
         * - 100::/64 (100:: to 100::ffff:ffff:ffff:ffff)
         *
         * @see https://datatracker.ietf.org/doc/html/rfc6666
         * @returns {boolean} true if this IPv6 address is discard-only, false otherwise
         */
      isDiscardOnly() {
        return _IPv6.DISCARD_ONLY_RANGE.contains(this);
      }
      /**
         * Gets the kind/category of this IPv6 address.
         *
         * Returns the most specific kind that matches this address. The check order ensures
         * correct classification when address ranges overlap:
         * 1. Unspecified (::)
         * 2. Loopback (::1)
         * 3. Multicast (ff00::/8)
         * 4. Documentation (2001:db8::/32 and 3fff::/20)
         * 5. IPv4-Mapped (::ffff:0:0/96)
         * 6. Discard-Only (100::/64)
         * 7. Link-Local (fe80::/10)
         * 8. Unique Local Address/Private (fc00::/7)
         * 9. Global Unicast (everything else, per RFC 4291)
         * 10. Unknown (fallback for reserved/unassigned ranges)
         *
         * According to RFC 4291, Global Unicast addresses are defined as "everything else" -
         * any address that does not match the other specific address types.
         *
         * @see https://datatracker.ietf.org/doc/html/rfc4291
         * @returns {IPv6AddressKind} the kind of this IPv6 address
         */
      getKind() {
        if (this.isUnspecified()) {
          return "Unspecified";
        }
        if (this.isLoopback()) {
          return "Loopback";
        }
        if (this.isMulticast()) {
          return "Multicast";
        }
        if (this.isDocumentation()) {
          return "Documentation";
        }
        if (this.isIPv4Mapped()) {
          return "IPv4-Mapped IPv6";
        }
        if (this.isDiscardOnly()) {
          return "Discard-Only";
        }
        if (this.isLinkLocal()) {
          return "Link-Local";
        }
        if (this.isPrivate()) {
          return "Unique Local Address";
        }
        if (this.isGlobalUnicast()) {
          return "Global Unicast";
        }
        return "Unknown";
      }
      constructFromBigIntValue(ipv6Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let binaryString = (0, BinaryUtils_4.numberToBinaryString)(ipv6Number);
        return [
          ipv6Number,
          this.binaryStringToHexadecatets(binaryString)
        ];
      }
      constructFromHexadecimalDottedString(expandedIPv6) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let stringHexadecimals = expandedIPv6.split(":");
        let hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
          return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        let value = BigInt(`0b${(0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(expandedIPv6)}`);
        return [
          value,
          hexadecatet
        ];
      }
      binaryStringToHexadecatets(binaryString) {
        let hexadecimalString = (0, HexadecimalUtils_1.binaryStringToHexadecimalString)(binaryString);
        while (hexadecimalString.length % 4 != 0) {
          hexadecimalString = "0" + hexadecimalString;
        }
        let hexadecimalStrings = hexadecimalString.match(/.{1,4}/g);
        return hexadecimalStrings.map((stringHexadecatet) => {
          return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
      }
    };
    exports.IPv6 = IPv6;
    IPv6.PRIVATE_RANGE = IPRange_2.IPv6CidrRange.fromCidr("fc00::/7");
    IPv6.DOCUMENTATION_RANGES = [
      IPRange_2.IPv6CidrRange.fromCidr("2001:db8::/32"),
      IPRange_2.IPv6CidrRange.fromCidr("3fff::/20")
    ];
    IPv6.MULTICAST_RANGE = IPRange_2.IPv6CidrRange.fromCidr("ff00::/8");
    IPv6.UNSPECIFIED_RANGE = IPRange_2.IPv6CidrRange.fromCidr("::/128");
    IPv6.LOOPBACK_RANGE = IPRange_2.IPv6CidrRange.fromCidr("::1/128");
    IPv6.LINK_LOCAL_RANGE = IPRange_2.IPv6CidrRange.fromCidr("fe80::/10");
    IPv6.DISCARD_ONLY_RANGE = IPRange_2.IPv6CidrRange.fromCidr("100::/64");
    var IPv4Mask = class _IPv4Mask extends IPv43 {
      /**
         * A convenience method for creating an instance of IPv4Mask. The passed strings need to be a valid IPv4
         * number in dot-decimal notation.
         *
         * @param {string} rawValue The passed string in dot-decimal notation
         * @returns {IPv4Mask} the instance of IPv4Mask
         */
      static fromDecimalDottedString(rawValue) {
        return new _IPv4Mask(rawValue);
      }
      /**
         * Constructor for creating an instance of IPv4Mask.
         * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
         *
         * @param {string} ipString The passed string in dot-decimal notation
         */
      constructor(ipString) {
        super(ipString);
        this.octets = [];
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidIPv4Mask(ipString);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let stringOctets = ipString.split(".");
        this.octets = stringOctets.map((rawOctet) => {
          return Octet_1.Octet.fromString(rawOctet);
        });
        let binaryString = (0, BinaryUtils_1.dottedDecimalNotationToBinaryString)(ipString);
        this.prefix = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);
      }
    };
    exports.IPv4Mask = IPv4Mask;
    var IPv6Mask = class _IPv6Mask extends IPv6 {
      /**
         * A convenience method for creating an instance of IPv6Mask.
         * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
         *
         * @param {string} rawValue The passed string in textual notation
         * @returns {IPv6Mask} the instance of IPv6Mask
         */
      static fromHexadecatet(rawValue) {
        return new _IPv6Mask(rawValue);
      }
      /**
         * Constructor for creating an instance of IPv6Mask.
         * The passed strings need to be a valid IPv6 mask number in dot-decimal notation
         *
         * @param {string} ipString The passed IPv6 string
         */
      constructor(ipString) {
        super(ipString);
        this.hexadecatet = [];
        let isValid;
        let message;
        let expandedIPv6 = (0, IPv6Utils_1.expandIPv6Number)(ipString);
        [isValid, message] = Validator_1.Validator.isValidIPv6Mask(expandedIPv6);
        if (!isValid) {
          throw new Error(message.filter((msg) => {
            return msg !== "";
          }).toString());
        }
        let stringHexadecimals = expandedIPv6.split(":");
        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
          return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        let binaryString = (0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(expandedIPv6);
        this.prefix = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);
        this.value = BigInt(`0b${(0, HexadecimalUtils_2.hexadectetNotationToBinaryString)(expandedIPv6)}`);
      }
    };
    exports.IPv6Mask = IPv6Mask;
    function isIPv4(ip) {
      return ip.bitSize === 32;
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPNumType.js
var require_IPNumType = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPNumType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPPool.js
var require_IPPool = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPPool.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Pool = void 0;
    var IPRange_1 = require_IPRange();
    var Prefix_1 = require_Prefix();
    var Pool = class _Pool {
      /**
         * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
         * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
         */
      static fromIP(ipNumbers) {
        let ranges = ipNumbers.map((ip) => {
          return IPRange_1.RangedSet.fromSingleIP(ip);
        });
        return new _Pool(ranges);
      }
      /**
         * Convenient method for creating an instance from arrays of {@link RangedSet}.
         *
         * @param ipRanges the arrays of {@link RangedSet}'s that will make up the pool.
         */
      // TODO: TSE: This makes it possible to create an instance containing both Range set of IPv4 and IPv6
      static fromRangeSet(ipRanges) {
        return new _Pool(ipRanges);
      }
      /**
         * Convenient method for creating an instance from arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange}.
         *
         * @param cidrRanges the arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange} that will make up the pool.
         */
      static fromCidrRanges(cidrRanges) {
        let cidr = cidrRanges;
        let rangeSet = cidr.map((range) => {
          return range.toRangeSet();
        });
        return new _Pool(rangeSet);
      }
      /**
         * Constructor for an IP pool.
         *
         * Creates a Pool of IP ranges from supplied {@link RangedSet}'s
         *
         * @param ranges the array of IP ranges that would make up the pool.
         */
      constructor(ranges) {
        this.backingSet = new SortedSet();
        ranges.forEach((range) => {
          this.backingSet.add(range);
        });
      }
      /**
         * Returns an array of {@link RangedSet}'s that is contained within the pool
         */
      getRanges() {
        return this.backingSet.asArray();
      }
      /**
         * Returns an new {@link Pool} with all the IP ranges aggregated
         */
      aggregate() {
        let sortedRanges = this.backingSet.asArray();
        let mergedRanges = sortedRanges.reduce((accumulator, currentRange, currentIndex, array) => {
          if (accumulator.length == 0) {
            accumulator.push(currentRange);
            return accumulator;
          } else {
            let previous = accumulator.pop();
            let previousCidrRange = previous.toCidrRange();
            let currentCidrRange = currentRange.toCidrRange();
            if (previousCidrRange.isCidrMergeable(currentCidrRange)) {
              let merged = previousCidrRange.merge(currentCidrRange);
              accumulator.push(merged.toRangeSet());
              return accumulator;
            } else {
              if (!previous.contains(currentRange)) {
                accumulator.push(previous);
                accumulator.push(currentRange);
              } else {
                accumulator.push(previous);
              }
              return accumulator;
            }
          }
        }, []);
        let aggregatedPool = _Pool.fromRangeSet(mergedRanges);
        if (aggregatedPool.getRanges().length !== this.getRanges().length) {
          return aggregatedPool.aggregate();
        } else {
          return aggregatedPool;
        }
      }
      /**
         * Gets a single range of size of the given prefix from pool.
         * Only returns a range if there is a single range in the pool of same size or greater than given prefix.
         *
         * throws exception if the requested range cannot be got from the pool.
         *
         * @param prefix prefix range to retrieve
         * TODO TSE
         */
      getCidrRange(prefix) {
        if (prefix.toRangeSize() > this.getSize()) {
          throw new Error(`Not enough IP number in the pool for requested prefix: ${prefix}`);
        }
        let selectedCidrRange;
        let error;
        loop: for (let range of this.getRanges()) {
          for (let offset = 0n; offset + prefix.toRangeSize() <= range.getSize(); offset = offset + 1n) try {
            let selectedRange = range.takeSubRange(offset, prefix.toRangeSize());
            selectedCidrRange = selectedRange.toCidrRange();
            let remaining = range.difference(selectedRange);
            this.removeExact(range);
            this.add(remaining);
            break loop;
          } catch (e) {
            if (e instanceof RangeError) {
              continue loop;
            }
            error = e instanceof Error ? e : new Error(String(e));
          }
        }
        if (selectedCidrRange) {
          return selectedCidrRange;
        } else {
          throw error === void 0 ? new Error(`No range big enough in the pool for requested prefix: ${prefix}`) : error;
        }
      }
      /**
         * Gets a single or multiple ranges that fulfils the given prefix from the pool.
         *
         * throws exception if the requested range cannot be got from the pool.
         *
         * @param reqprefix prefix range to retrieve
         */
      getCidrRanges(reqprefix) {
        if (reqprefix.toRangeSize() > this.getSize()) {
          throw new Error("Prefix greater than pool");
        }
        let go = (reqprefix2, prefix, accummulated) => {
          try {
            let singleCidrRange = this.getCidrRange(prefix);
            accummulated.push(singleCidrRange);
            let currentSize = accummulated.reduce((previous, current) => {
              return previous + current.getSize();
            }, 0n);
            if (reqprefix2.toRangeSize() === currentSize) {
              return accummulated;
            } else {
              return go(reqprefix2, prefix, accummulated);
            }
          } catch (e) {
            let lowerPrefix = (0, Prefix_1.isIPv4Prefix)(prefix) ? Prefix_1.IPv4Prefix.fromNumber(prefix.getValue() + 1n) : Prefix_1.IPv6Prefix.fromNumber(prefix.getValue() + 1n);
            return go(reqprefix2, lowerPrefix, accummulated);
          }
        };
        return go(reqprefix, reqprefix, []);
      }
      /**
         * Returns the size of IP numbers in the pool
         */
      getSize() {
        return this.aggregate().getRanges().reduce((previous, current) => {
          return previous + current.getSize();
        }, 0n);
      }
      /**
         * Empties the pool and fill it with given ranges
         *
         * @param ipRanges the range to fill the pool with after emptying
         */
      resetWith(ipRanges) {
        this.backingSet.clear();
        this.backingSet = this.backingSet.add(ipRanges);
      }
      /**
         * Removes the given range from the pool. It only removes if the exact range exist in the pool.
         * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
         *
         * @param rangeToRemove range to remove from ppol
         */
      removeExact(rangeToRemove) {
        let updatedSet = this.backingSet.removeExact(rangeToRemove);
        let isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
      }
      /**
         * Removes the given range from the pool. If the given range overlaps, then it removes the overlapping portion.
         * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
         *
         * @param rangeToRemove range to remove from ppol
         */
      removeOverlapping(rangeToRemove) {
        let updatedSet = this.backingSet.removeOverlapping(rangeToRemove);
        let isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
      }
      /**
         * Adds the given range to the pool.
         *
         * @param range to add to pool.
         */
      add(range) {
        this.backingSet = this.backingSet.add(range);
      }
      /**
         * Removes all ranges from pool
         */
      clear() {
        this.backingSet.clear();
      }
    };
    exports.Pool = Pool;
    var SortedSet = class _SortedSet {
      sortArray(array) {
        array.sort((a, b) => {
          if (a.isLessThan(b)) {
            return -1;
          }
          if (a.isGreaterThan(b)) {
            return 1;
          }
          return 0;
        });
        return array;
      }
      constructor(array) {
        if (array) {
          this.backingArray = this.sortArray(array);
        } else {
          this.backingArray = new Array();
        }
      }
      asArray() {
        return this.backingArray;
      }
      isEquals(other) {
        if (this.backingArray.length !== other.asArray().length) {
          return false;
        }
        return this.backingArray.every((value, index) => {
          return value.getSize() === other.asArray()[index].getSize();
        });
      }
      add(item) {
        let array = this.backingArray;
        if ("push" in item) {
          array = array.concat(item);
        } else {
          array.push(item);
        }
        return new _SortedSet(this.sortArray(array));
      }
      removeExact(items) {
        let filtered = this.backingArray.filter((currentItem) => {
          if ("push" in items) {
            return items.find((item) => item.isEquals(currentItem)) !== void 0;
          } else {
            return !items.isEquals(currentItem);
          }
        });
        return new _SortedSet(this.sortArray(filtered));
      }
      removeOverlapping(items) {
        let filtered = this.backingArray.flatMap((backingItem) => {
          if ("push" in items) {
            return items.flatMap((item) => {
              if (backingItem.contains(item)) {
                return backingItem.difference(item);
              } else if (backingItem.inside(item)) {
                return new Array();
              } else if (backingItem.isOverlapping(item)) {
                return [
                  backingItem.subtract(item)
                ];
              } else {
                return [
                  item
                ];
              }
            });
          } else {
            try {
              return backingItem.difference(items);
            } catch (e) {
              return backingItem;
            }
          }
        });
        return new _SortedSet(this.sortArray(filtered));
      }
      clear() {
        this.backingArray = [];
      }
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPv6AddressKind.js
var require_IPv6AddressKind = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/IPv6AddressKind.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/index.js
var require_src = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ip-num/1.6.1/dist/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    __exportStar(require_BinaryUtils(), exports);
    __exportStar(require_Hexadecatet(), exports);
    __exportStar(require_HexadecimalUtils(), exports);
    __exportStar(require_IPNumber(), exports);
    __exportStar(require_IPNumType(), exports);
    __exportStar(require_IPPool(), exports);
    __exportStar(require_IPRange(), exports);
    __exportStar(require_IPv6AddressKind(), exports);
    __exportStar(require_IPv6Utils(), exports);
    __exportStar(require_Octet(), exports);
    __exportStar(require_Prefix(), exports);
    __exportStar(require_Validator(), exports);
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var escapeRe = /[&<>'"]/;
var stringBufferToString = async (buffer, callbacks) => {
  let str = "";
  callbacks ||= [];
  const resolvedBuffer = await Promise.all(buffer);
  for (let i = resolvedBuffer.length - 1; ; i--) {
    str += resolvedBuffer[i];
    i--;
    if (i < 0) {
      break;
    }
    let r = resolvedBuffer[i];
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    const isEscaped = r.isEscaped;
    r = await (typeof r === "object" ? r.toString() : r);
    if (typeof r === "object") {
      callbacks.push(...r.callbacks || []);
    }
    if (r.isEscaped ?? isEscaped) {
      str += r;
    } else {
      const buf = [
        str
      ];
      escapeToBuffer(r, buf);
      str = buf[0];
    }
  }
  return raw(str, callbacks);
};
var escapeToBuffer = (str, buffer) => {
  const match2 = str.search(escapeRe);
  if (match2 === -1) {
    buffer[0] += str;
    return;
  }
  let escape;
  let index;
  let lastIndex = 0;
  for (index = match2; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 39:
        escape = "&#39;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape;
    lastIndex = index + 1;
  }
  buffer[0] += str.substring(lastIndex, index);
};
var resolveCallbackSync = (str) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return str;
  }
  const buffer = [
    str
  ];
  const context = {};
  callbacks.forEach((c) => c({
    phase: HtmlEscapedCallbackPhase.Stringify,
    buffer,
    context
  }));
  return buffer[0];
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [
      str
    ];
  }
  const resStr = Promise.all(callbacks.map((c) => c({
    phase,
    buffer,
    context
  }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/constants.js
var DOM_RENDERER = Symbol("RENDERER");
var DOM_ERROR_HANDLER = Symbol("ERROR_HANDLER");
var DOM_STASH = Symbol("STASH");
var DOM_INTERNAL_TAG = Symbol("INTERNAL");
var DOM_MEMO = Symbol("MEMO");
var PERMALINK = Symbol("PERMALINK");

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/dom/utils.js
var setInternalTagFlag = (fn) => {
  ;
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/dom/context.js
var createContextProviderFunction = (values) => ({ value, children }) => {
  if (!children) {
    return void 0;
  }
  const props = {
    children: [
      {
        tag: setInternalTagFlag(() => {
          values.push(value);
        }),
        props: {}
      }
    ]
  };
  if (Array.isArray(children)) {
    props.children.push(...children.flat());
  } else {
    props.children.push(children);
  }
  props.children.push({
    tag: setInternalTagFlag(() => {
      values.pop();
    }),
    props: {}
  });
  const res = {
    tag: "",
    props,
    type: ""
  };
  res[DOM_ERROR_HANDLER] = (err) => {
    values.pop();
    throw err;
  };
  return res;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/context.js
var globalContexts = [];
var createContext = (defaultValue) => {
  const values = [
    defaultValue
  ];
  const context = (props) => {
    values.push(props.value);
    let string;
    try {
      string = props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : "";
    } finally {
      values.pop();
    }
    if (string instanceof Promise) {
      return string.then((resString) => raw(resString, resString.callbacks));
    } else {
      return raw(string);
    }
  };
  context.values = values;
  context.Provider = context;
  context[DOM_RENDERER] = createContextProviderFunction(values);
  globalContexts.push(context);
  return context;
};
var useContext = (context) => {
  return context.values.at(-1);
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/intrinsic-element/common.js
var deDupeKeyMap = {
  title: [],
  script: [
    "src"
  ],
  style: [
    "data-href"
  ],
  link: [
    "href"
  ],
  meta: [
    "name",
    "httpEquiv",
    "charset",
    "itemProp"
  ]
};
var domRenderers = {};
var dataPrecedenceAttr = "data-precedence";

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/intrinsic-element/components.js
var components_exports = {};
__export(components_exports, {
  button: () => button,
  form: () => form,
  input: () => input,
  link: () => link,
  meta: () => meta,
  script: () => script,
  style: () => style,
  title: () => title
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/children.js
var toArray = (children) => Array.isArray(children) ? children : [
  children
];

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/intrinsic-element/components.js
var metaTagMap = /* @__PURE__ */ new WeakMap();
var insertIntoHead = (tagName, tag, props, precedence) => ({ buffer, context }) => {
  if (!buffer) {
    return;
  }
  const map = metaTagMap.get(context) || {};
  metaTagMap.set(context, map);
  const tags = map[tagName] ||= [];
  let duped = false;
  const deDupeKeys = deDupeKeyMap[tagName];
  if (deDupeKeys.length > 0) {
    LOOP: for (const [, tagProps] of tags) {
      for (const key of deDupeKeys) {
        if ((tagProps?.[key] ?? null) === props?.[key]) {
          duped = true;
          break LOOP;
        }
      }
    }
  }
  if (duped) {
    buffer[0] = buffer[0].replaceAll(tag, "");
  } else if (deDupeKeys.length > 0) {
    tags.push([
      tag,
      props,
      precedence
    ]);
  } else {
    tags.unshift([
      tag,
      props,
      precedence
    ]);
  }
  if (buffer[0].indexOf("</head>") !== -1) {
    let insertTags;
    if (precedence === void 0) {
      insertTags = tags.map(([tag2]) => tag2);
    } else {
      const precedences = [];
      insertTags = tags.map(([tag2, , precedence2]) => {
        let order = precedences.indexOf(precedence2);
        if (order === -1) {
          precedences.push(precedence2);
          order = precedences.length - 1;
        }
        return [
          tag2,
          order
        ];
      }).sort((a, b) => a[1] - b[1]).map(([tag2]) => tag2);
    }
    insertTags.forEach((tag2) => {
      buffer[0] = buffer[0].replaceAll(tag2, "");
    });
    buffer[0] = buffer[0].replace(/(?=<\/head>)/, insertTags.join(""));
  }
};
var returnWithoutSpecialBehavior = (tag, children, props) => raw(new JSXNode(tag, props, toArray(children ?? [])).toString());
var documentMetadataTag = (tag, children, props, sort) => {
  if ("itemProp" in props) {
    return returnWithoutSpecialBehavior(tag, children, props);
  }
  let { precedence, blocking, ...restProps } = props;
  precedence = sort ? precedence ?? "" : void 0;
  if (sort) {
    restProps[dataPrecedenceAttr] = precedence;
  }
  const string = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string instanceof Promise) {
    return string.then((resString) => raw(string, [
      ...resString.callbacks || [],
      insertIntoHead(tag, resString, restProps, precedence)
    ]));
  } else {
    return raw(string, [
      insertIntoHead(tag, string, restProps, precedence)
    ]);
  }
};
var title = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2) {
    const context = useContext(nameSpaceContext2);
    if (context === "svg" || context === "head") {
      return new JSXNode("title", props, toArray(children ?? []));
    }
  }
  return documentMetadataTag("title", children, props, false);
};
var script = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if ([
    "src",
    "async"
  ].some((k) => !props[k]) || nameSpaceContext2 && useContext(nameSpaceContext2) === "head") {
    return returnWithoutSpecialBehavior("script", children, props);
  }
  return documentMetadataTag("script", children, props, false);
};
var style = ({ children, ...props }) => {
  if (![
    "href",
    "precedence"
  ].every((k) => k in props)) {
    return returnWithoutSpecialBehavior("style", children, props);
  }
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag("style", children, props, true);
};
var link = ({ children, ...props }) => {
  if ([
    "onLoad",
    "onError"
  ].some((k) => k in props) || props.rel === "stylesheet" && (!("precedence" in props) || "disabled" in props)) {
    return returnWithoutSpecialBehavior("link", children, props);
  }
  return documentMetadataTag("link", children, props, "precedence" in props);
};
var meta = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2 && useContext(nameSpaceContext2) === "head") {
    return returnWithoutSpecialBehavior("meta", children, props);
  }
  return documentMetadataTag("meta", children, props, false);
};
var newJSXNode = (tag, { children, ...props }) => new JSXNode(tag, props, toArray(children ?? []));
var form = (props) => {
  if (typeof props.action === "function") {
    props.action = PERMALINK in props.action ? props.action[PERMALINK] : void 0;
  }
  return newJSXNode("form", props);
};
var formActionableElement = (tag, props) => {
  if (typeof props.formAction === "function") {
    props.formAction = PERMALINK in props.formAction ? props.formAction[PERMALINK] : void 0;
  }
  return newJSXNode(tag, props);
};
var input = (props) => formActionableElement("input", props);
var button = (props) => formActionableElement("button", props);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/utils.js
var normalizeElementKeyMap = /* @__PURE__ */ new Map([
  [
    "className",
    "class"
  ],
  [
    "htmlFor",
    "for"
  ],
  [
    "crossOrigin",
    "crossorigin"
  ],
  [
    "httpEquiv",
    "http-equiv"
  ],
  [
    "itemProp",
    "itemprop"
  ],
  [
    "fetchPriority",
    "fetchpriority"
  ],
  [
    "noModule",
    "nomodule"
  ],
  [
    "formAction",
    "formaction"
  ]
]);
var normalizeIntrinsicElementKey = (key) => normalizeElementKeyMap.get(key) || key;
var styleObjectForEach = (style2, fn) => {
  for (const [k, v] of Object.entries(style2)) {
    const key = k[0] === "-" || !/[A-Z]/.test(k) ? k : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    fn(key, v == null ? null : typeof v === "number" ? !key.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/) ? `${v}px` : `${v}` : v);
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/base.js
var nameSpaceContext = void 0;
var getNameSpaceContext = () => nameSpaceContext;
var toSVGAttributeName = (key) => /[A-Z]/.test(key) && key.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var emptyTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "download",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
];
var childrenToStringToBuffer = (children, buffer) => {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (typeof child === "string") {
      escapeToBuffer(child, buffer);
    } else if (typeof child === "boolean" || child === null || child === void 0) {
      continue;
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer);
    } else if (typeof child === "number" || child.isEscaped) {
      ;
      buffer[0] += child;
    } else if (child instanceof Promise) {
      buffer.unshift("", child);
    } else {
      childrenToStringToBuffer(child, buffer);
    }
  }
};
var JSXNode = class {
  tag;
  props;
  key;
  children;
  isEscaped = true;
  localContexts;
  constructor(tag, props, children) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  get type() {
    return this.tag;
  }
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    const buffer = [
      ""
    ];
    this.localContexts?.forEach(([context, value]) => {
      context.values.push(value);
    });
    try {
      this.toStringToBuffer(buffer);
    } finally {
      this.localContexts?.forEach(([context]) => {
        context.values.pop();
      });
    }
    return buffer.length === 1 ? "callbacks" in buffer ? resolveCallbackSync(raw(buffer[0], buffer.callbacks)).toString() : buffer[0] : stringBufferToString(buffer, buffer.callbacks);
  }
  toStringToBuffer(buffer) {
    const tag = this.tag;
    const props = this.props;
    let { children } = this;
    buffer[0] += `<${tag}`;
    const normalizeKey = nameSpaceContext && useContext(nameSpaceContext) === "svg" ? (key) => toSVGAttributeName(normalizeIntrinsicElementKey(key)) : (key) => normalizeIntrinsicElementKey(key);
    for (let [key, v] of Object.entries(props)) {
      key = normalizeKey(key);
      if (key === "children") {
      } else if (key === "style" && typeof v === "object") {
        let styleStr = "";
        styleObjectForEach(v, (property, value) => {
          if (value != null) {
            styleStr += `${styleStr ? ";" : ""}${property}:${value}`;
          }
        });
        buffer[0] += ' style="';
        escapeToBuffer(styleStr, buffer);
        buffer[0] += '"';
      } else if (typeof v === "string") {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v, buffer);
        buffer[0] += '"';
      } else if (v === null || v === void 0) {
      } else if (typeof v === "number" || v.isEscaped) {
        buffer[0] += ` ${key}="${v}"`;
      } else if (typeof v === "boolean" && booleanAttributes.includes(key)) {
        if (v) {
          buffer[0] += ` ${key}=""`;
        }
      } else if (key === "dangerouslySetInnerHTML") {
        if (children.length > 0) {
          throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        }
        children = [
          raw(v.__html)
        ];
      } else if (v instanceof Promise) {
        buffer[0] += ` ${key}="`;
        buffer.unshift('"', v);
      } else if (typeof v === "function") {
        if (!key.startsWith("on") && key !== "ref") {
          throw new Error(`Invalid prop '${key}' of type 'function' supplied to '${tag}'.`);
        }
      } else {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v.toString(), buffer);
        buffer[0] += '"';
      }
    }
    if (emptyTags.includes(tag) && children.length === 0) {
      buffer[0] += "/>";
      return;
    }
    buffer[0] += ">";
    childrenToStringToBuffer(children, buffer);
    buffer[0] += `</${tag}>`;
  }
};
var JSXFunctionNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    const { children } = this;
    const res = this.tag.call(null, {
      ...this.props,
      children: children.length <= 1 ? children[0] : children
    });
    if (typeof res === "boolean" || res == null) {
      return;
    } else if (res instanceof Promise) {
      if (globalContexts.length === 0) {
        buffer.unshift("", res);
      } else {
        const currentContexts = globalContexts.map((c) => [
          c,
          c.values.at(-1)
        ]);
        buffer.unshift("", res.then((childRes) => {
          if (childRes instanceof JSXNode) {
            childRes.localContexts = currentContexts;
          }
          return childRes;
        }));
      }
    } else if (res instanceof JSXNode) {
      res.toStringToBuffer(buffer);
    } else if (typeof res === "number" || res.isEscaped) {
      buffer[0] += res;
      if (res.callbacks) {
        buffer.callbacks ||= [];
        buffer.callbacks.push(...res.callbacks);
      }
    } else {
      escapeToBuffer(res, buffer);
    }
  }
};
var JSXFragmentNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    childrenToStringToBuffer(this.children, buffer);
  }
};
var initDomRenderer = false;
var jsxFn = (tag, props, children) => {
  if (!initDomRenderer) {
    for (const k in domRenderers) {
      ;
      components_exports[k][DOM_RENDERER] = domRenderers[k];
    }
    initDomRenderer = true;
  }
  if (typeof tag === "function") {
    return new JSXFunctionNode(tag, props, children);
  } else if (components_exports[tag]) {
    return new JSXFunctionNode(components_exports[tag], props, children);
  } else if (tag === "svg" || tag === "head") {
    nameSpaceContext ||= createContext("");
    return new JSXNode(tag, props, [
      new JSXFunctionNode(nameSpaceContext, {
        value: tag
      }, children)
    ]);
  } else {
    return new JSXNode(tag, props, children);
  }
};
var Fragment = ({ children }) => {
  return new JSXFragmentNode("", {
    children
  }, Array.isArray(children) ? children : children ? [
    children
  ] : []);
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/jsx/jsx-dev-runtime.js
function jsxDEV(tag, props, key) {
  let node;
  if (!props || !("children" in props)) {
    node = jsxFn(tag, props, []);
  } else {
    const children = props.children;
    node = Array.isArray(children) ? jsxFn(tag, props, children) : jsxFn(tag, props, [
      children
    ]);
  }
  node.key = key;
  return node;
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  constructor(status = 500, options) {
    super(options?.message, {
      cause: options?.cause
    });
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, {
      all,
      dot
    });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form2 = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form2[key] = value;
    } else {
      handleParsingAllValues(form2, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form2).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form2, key, value);
        delete form2[key];
      }
    });
  }
  return form2;
}
var handleParsingAllValues = (form2, key, value) => {
  if (form2[key] !== void 0) {
    if (Array.isArray(form2[key])) {
      ;
      form2[key].push(value);
    } else {
      form2[key] = [
        form2[key],
        value
      ];
    }
  } else {
    if (!key.endsWith("[]")) {
      form2[key] = value;
    } else {
      form2[key] = [
        value
      ];
    }
  }
};
var handleParsingNestedValues = (form2, key, value) => {
  let nestedForm = form2;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([
      mark,
      match2
    ]);
    return mark;
  });
  return {
    groups,
    path
  };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [
          cacheKey,
          match2[1],
          new RegExp(`^${match2[2]}(?=/${next})`)
        ] : [
          label,
          match2[1],
          new RegExp(`^${match2[2]}$`)
        ];
      } else {
        patternCache[cacheKey] = [
          label,
          match2[1],
          true
        ];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [
    []
  ]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, {
      status,
      headers: responseHeaders
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html2, arg, headers) => {
    const res = (html22) => this.#newResponse(html22, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html2 === "object" ? resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html2);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "patch"
];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [
      ...METHODS,
      METHOD_NAME_ALL_LOWERCASE
    ];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [
        path
      ].flat()) {
        this.#path = p;
        for (const m of [
          method
        ].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [
        options2
      ];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [
        c.env,
        executionContext
      ];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [
      handler,
      r
    ]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, {
      env
    });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input2, requestInit, Env, executionCtx) => {
    if (input2 instanceof Request) {
      return this.fetch(requestInit ? new Request(input2, requestInit) : input2, Env, executionCtx);
    }
    input2 = input2.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input2) ? input2 : `http://localhost${mergePath("/", input2)}`, requestInit), Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [
        [],
        emptyParam
      ];
    }
    const index = match3.indexOf("", 1);
    return [
      matcher[1][index],
      match3
    ];
  };
  this.match = match2;
  return match2(method, path);
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? [
      "",
      "",
      ONLY_WILDCARD_REG_EXP_STR
    ] : [
      "",
      "",
      LABEL_REG_EXP_STR
    ] : token === "/*" ? [
      "",
      "",
      TAIL_WILDCARD_REG_EXP_STR
    ] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([
          name,
          node.#varIndex
        ]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = {
    varIndex: 0
  };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [
          mark,
          m
        ];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [
        /^$/,
        [],
        []
      ];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [
      new RegExp(`^${regexp}`),
      indexReplacementMap,
      paramReplacementMap
    ];
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/reg-exp-router/router.js
var nullMatcher = [
  /^$/,
  [],
  /* @__PURE__ */ Object.create(null)
];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [
    !/\*|\/:/.test(route[0]),
    ...route
  ]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [
        handlers.map(([h]) => [
          h,
          /* @__PURE__ */ Object.create(null)
        ]),
        emptyParam
      ];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [
        h,
        paramIndexMap
      ];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [
    regexp,
    handlerMap,
    staticMap
  ];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [
        ...middleware[k]
      ];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = {
      [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null)
    };
    this.#routes = {
      [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null)
    };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [
        middleware,
        routes
      ].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [
            ...handlerMap[METHOD_NAME_ALL][p]
          ];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([
              handler,
              paramCount
            ]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([
            handler,
            paramCount
          ]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [
      path
    ];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([
            handler,
            paramCount - len + i + 1
          ]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [
      this.#middleware,
      this.#routes
    ].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [
        path,
        r[method][path]
      ]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [
          path,
          r[METHOD_NAME_ALL][path]
        ]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([
      method,
      path,
      handler
    ]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [
        router
      ];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = {
        handler,
        possibleKeys: [],
        score: 0
      };
      this.#methods = [
        m
      ];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [
      curNode
    ];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(...this.#getHandlerSets(nextNode.#children["*"], method, node.#params));
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : {
            ...node.#params
          };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(...this.#getHandlerSets(child.#children["*"], method, params, node.#params));
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [
      handlerSets.map(({ handler, params }) => [
        handler,
        params
      ])
    ];
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/hono/4.10.3/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [
        new RegExpRouter(),
        new TrieRouter()
      ]
    });
  }
};

// wgmd/main.ts
var SocketConnection = class {
  #conn;
  static async connect(path = "/var/run/wgmd.sock") {
    const conn = await Deno.connect({
      transport: "unix",
      path: "/var/run/wgmd.sock"
    });
    return new this(conn);
  }
  constructor(conn) {
    this.#conn = conn;
  }
  async addInterface(req) {
    return await this.#sendMessage({
      type: "add_interface",
      ...req
    });
  }
  async removeInterface(req) {
    return await this.#sendMessage({
      type: "remove_interface",
      ...req
    });
  }
  async queryAllInterfaces() {
    return await this.#sendMessage({
      type: "interfaces"
    });
  }
  async queryInterface({ id }) {
    return await this.#sendMessage({
      type: "query_interface",
      id
    });
  }
  async addUser(req) {
    return await this.#sendMessage({
      type: "add_user",
      ...req
    });
  }
  async removeUser(req) {
    return await this.#sendMessage({
      type: "remove_user",
      ...req
    });
  }
  async queryUser({ id, if_id }) {
    return await this.#sendMessage({
      type: "query_user",
      user_id: id,
      interface_id: if_id
    });
  }
  async export() {
    return await this.#sendMessage({
      type: "export"
    });
  }
  async #sendMessage(m) {
    const encoder = new TextEncoder();
    this.#conn.write(encoder.encode(JSON.stringify(m) + "\n"));
    const buf = new Uint8Array(1e3);
    const b = await this.#conn.read(buf);
    const decoder = new TextDecoder();
    const s = decoder.decode(buf.subarray(0, b));
    return JSON.parse(s);
  }
};

// ui/Main.tsx
var import_ip_num = __toESM(require_src());
var BlockElementsCSS = {
  display: "block",
  margin: ".5em 0 0 0"
};
var NetmaskPicker = () => {
  return /* @__PURE__ */ jsxDEV("select", {
    name: "netmask",
    style: BlockElementsCSS,
    children: Array.from({
      length: 32
    }).map((_v, i) => {
      return /* @__PURE__ */ jsxDEV("option", {
        value: i + 1,
        children: [
          "/",
          i + 1
        ]
      }, i);
    })
  });
};
var MainView = ({ interfaces }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, {
    children: [
      /* @__PURE__ */ jsxDEV("h1", {
        children: "MainView"
      }),
      /* @__PURE__ */ jsxDEV("ul", {
        children: interfaces.map((v, i) => {
          return /* @__PURE__ */ jsxDEV("li", {
            children: /* @__PURE__ */ jsxDEV("a", {
              href: "/if/" + v.id,
              children: v.name
            })
          }, i);
        })
      }),
      /* @__PURE__ */ jsxDEV("h2", {
        children: "Add Interface"
      }),
      /* @__PURE__ */ jsxDEV("form", {
        action: "/api/interface",
        method: "post",
        children: [
          /* @__PURE__ */ jsxDEV("label", {
            for: "name",
            style: BlockElementsCSS,
            children: "Interfacename:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "text",
            name: "name",
            style: BlockElementsCSS
          }),
          /* @__PURE__ */ jsxDEV("label", {
            for: "address",
            style: BlockElementsCSS,
            children: "Address:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "text",
            name: "address",
            style: BlockElementsCSS
          }),
          /* @__PURE__ */ jsxDEV("label", {
            for: "netmask",
            style: BlockElementsCSS,
            children: "Networksize:"
          }),
          /* @__PURE__ */ jsxDEV(NetmaskPicker, {}),
          /* @__PURE__ */ jsxDEV("label", {
            for: "endpoint",
            style: BlockElementsCSS,
            children: "Public Endpoint Address:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "text",
            name: "endpoint",
            style: BlockElementsCSS
          }),
          /* @__PURE__ */ jsxDEV("label", {
            for: "port",
            style: BlockElementsCSS,
            children: "Public Listen Port:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "number",
            name: "port"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "hidden",
            name: "redirect",
            value: "/if/"
          }),
          /* @__PURE__ */ jsxDEV("button", {
            type: "submit",
            style: BlockElementsCSS,
            children: "Add"
          })
        ]
      }),
      /* @__PURE__ */ jsxDEV("h2", {
        children: "Actions"
      }),
      /* @__PURE__ */ jsxDEV("form", {
        action: "/api/config/export",
        children: /* @__PURE__ */ jsxDEV("button", {
          type: "submit",
          children: "Export"
        })
      })
    ]
  });
};
var InterfaceView = ({ def }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, {
    children: [
      /* @__PURE__ */ jsxDEV("h1", {
        children: [
          "Interface: ",
          def.name
        ]
      }),
      /* @__PURE__ */ jsxDEV("a", {
        href: "/",
        children: "Back"
      }),
      /* @__PURE__ */ jsxDEV("p", {
        children: [
          "Address: ",
          def.netaddress,
          "/",
          def.netmask
        ]
      }),
      /* @__PURE__ */ jsxDEV("p", {
        children: [
          "Network Address: ",
          def.netaddress
        ]
      }),
      /* @__PURE__ */ jsxDEV("p", {
        children: "Users"
      }),
      /* @__PURE__ */ jsxDEV("ul", {
        children: def.users.map((v, i) => {
          return /* @__PURE__ */ jsxDEV("li", {
            children: [
              /* @__PURE__ */ jsxDEV("span", {
                children: [
                  v.name,
                  ": ",
                  new import_ip_num.IPv4(v.address).toString()
                ]
              }),
              /* @__PURE__ */ jsxDEV("a", {
                href: `/api/interface/${def.id}/users/${v.id}/client`,
                children: "Client"
              })
            ]
          }, i + "-" + v.id);
        })
      }),
      /* @__PURE__ */ jsxDEV("h2", {
        children: "Add User"
      }),
      /* @__PURE__ */ jsxDEV("form", {
        action: `/api/interface/${def.id}/users`,
        method: "post",
        children: [
          /* @__PURE__ */ jsxDEV("label", {
            for: "name",
            children: "Username:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "text",
            name: "name"
          }),
          /* @__PURE__ */ jsxDEV("label", {
            for: "ip",
            children: "Client IP:"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "text",
            name: "ip"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "hidden",
            name: "redirect",
            value: "/if/"
          }),
          /* @__PURE__ */ jsxDEV("input", {
            type: "submit"
          })
        ]
      }),
      /* @__PURE__ */ jsxDEV("h2", {
        children: "Actions"
      }),
      /* @__PURE__ */ jsxDEV("form", {
        action: `/api/interface/${def.id}/delete`,
        method: "post",
        children: [
          /* @__PURE__ */ jsxDEV("input", {
            type: "hidden",
            name: "redirect",
            value: "/"
          }),
          /* @__PURE__ */ jsxDEV("button", {
            type: "submit",
            children: "Delete"
          })
        ]
      })
    ]
  });
};

// api.tsx
var import_ip_num2 = __toESM(require_src());
var ConfigRoutes = () => {
  const route = new Hono2();
  route.get("/export", async (c) => {
    const socket = c.get("socket");
    await socket.export();
    return c.text("ok");
  });
  return route;
};
var createInterfaceCreationRequest = (data) => {
  if (!data.has("name")) throw new HTTPException(401, {
    message: "missing name"
  });
  const name = data.get("name");
  if (!data.has("address")) throw new HTTPException(401, {
    message: "missing address"
  });
  const address = data.get("address");
  if (!data.has("endpoint")) throw new HTTPException(401, {
    message: "missing endpoint"
  });
  const endpoint = data.get("endpoint");
  if (!data.has("port")) throw new HTTPException(401, {
    message: "missing port"
  });
  const port = parseInt(data.get("port"));
  if (!data.has("netmask")) throw new HTTPException(401, {
    message: "missing netmask"
  });
  const netmask = parseInt(data.get("netmask"));
  const addressIp = new import_ip_num2.IPv4(address);
  const mtu = 1420;
  return {
    if_name: name,
    address: addressIp.toString(),
    endpoint,
    mtu,
    port,
    subnet: netmask
  };
};
var InterfaceApi = () => {
  const app = new Hono2();
  app.get("/", async (c) => {
    const socket = c.get("socket");
    const data = await socket.queryAllInterfaces();
    return c.json(data);
  });
  app.post("/", async (c) => {
    const socket = c.get("socket");
    const data = await c.req.formData();
    const request = await createInterfaceCreationRequest(data);
    const r = await socket.addInterface(request);
    if (r.type !== "add_interface") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    const redirect = data.has("redirect") ? data.get("redirect") + r.data : "api/" + r.data;
    c.status(201);
    return c.redirect(redirect);
  });
  app.get("/:id", async (c) => {
    const socket = c.get("socket");
    const id = parseInt(c.req.param("id"));
    const query = await socket.queryInterface({
      id
    });
    if (query.type !== "query_interface") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    return c.json(query.data);
  });
  app.delete("/:id", async (c) => {
    const socket = c.get("socket");
    const id = parseInt(c.req.param("id"));
    const query = await socket.removeInterface({
      "id": id
    });
    if (query.type !== "status") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    c.status(200);
    return c.json(query.status);
  });
  app.post("/:id/delete", async (c) => {
    const socket = c.get("socket");
    const id = parseInt(c.req.param("id"));
    const query = await socket.removeInterface({
      "id": id
    });
    if (query.type !== "status") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    c.status(200);
    const data = await c.req.formData();
    const redirect = data.has("redirect") ? data.get("redirect") : "api/";
    return c.redirect(redirect);
  });
  return app;
};
var Api = () => {
  const router = new Hono2();
  router.route("/interface", InterfaceApi());
  router.route("/config", ConfigRoutes());
  return router;
};
function Root() {
  const root = new Hono2();
  root.use(async (c, next) => {
    c.set("socket", await SocketConnection.connect());
    await next();
  });
  root.get("/", async (c) => {
    const socket = c.get("socket");
    const res = await socket.queryAllInterfaces();
    if (res.type !== "interfaces") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    return c.html(/* @__PURE__ */ jsxDEV(MainView, {
      interfaces: res.data
    }));
  });
  root.get("/if/:id", async (c) => {
    const socket = c.get("socket");
    const id = parseInt(c.req.param("id"));
    const res = await socket.queryInterface({
      id
    });
    if (res.type !== "query_interface") return c.html(/* @__PURE__ */ jsxDEV("h1", {
      children: "Error"
    }));
    return c.html(/* @__PURE__ */ jsxDEV(InterfaceView, {
      def: res.data
    }));
  });
  root.route("/api", Api());
  return root;
}

// main.tsx
if (import.meta.main) {
  const app = Root();
  Deno.serve({
    port: 8080
  }, app.fetch);
}
