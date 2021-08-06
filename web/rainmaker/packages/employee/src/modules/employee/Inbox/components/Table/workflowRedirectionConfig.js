export const getWFConfig = (module, businessService, taskId) => {
  if (businessService == "ADVERTISEMENTNOC" || businessService == "PETNOC" || businessService == "ROADCUTNOC" || businessService == "SELLMEATNOC") {
    if (businessService == "ROADCUTNOC") {
      return {
        INITIATED: "/egov-opms/roadcutnoc-search-preview",
        DEFAULT: "/egov-opms/roadcutnoc-search-preview",
      };
    }
    else if (businessService == "SELLMEATNOC") {
      return {
        INITIATED: "/egov-opms/sellmeatnoc-search-preview",
        DEFAULT: "/egov-opms/sellmeatnoc-search-preview",
      }
    } else if (businessService == "ADVERTISEMENTNOC") {
      return {
        INITIATED: "/egov-opms/advertisementnoc-search-preview",
        DEFAULT: "/egov-opms/advertisementnoc-search-preview",
      };
    } else if (businessService == "PETNOC") {
      return {
        INITIATED: "/egov-opms/search-preview",
        DEFAULT: "/egov-opms/search-preview",
      };
    }
  }
  else if (businessService == "NULM") {
     if (taskId.includes('SUSVR')) {
      return {
        INITIATED: "/egov-nulm/view-svru",
        DEFAULT: "/egov-nulm/view-svru",
      };
    }
    else if (taskId.includes('SUSV')) {
      return {
        INITIATED: "/egov-nulm/view-susv",
        DEFAULT: "/egov-nulm/view-susv",
      };
    }
  }
  else if (businessService == "Engineering Issue Note" || businessService == "IT Issue Note" || businessService == "Caretaker Issue Note" || businessService == "MOH Issue Note") {
      return {
        INITIATED: "/egov-store-asset/view-indent-note",
        DEFAULT: "/egov-store-asset/view-indent-note",
      };
  }
  else if (businessService == "Engineering" || businessService == "IT" || businessService == "Caretaker" || businessService == "MOH") {
    if (taskId.includes('MRNIN')) {
      return {
        INITIATED: "/egov-store-asset/view-non-indent-issue-note",
        DEFAULT: "/egov-store-asset/view-non-indent-issue-note",
      };
    } else if (taskId.includes('MRNIW')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-inword",
        DEFAULT: "/egov-store-asset/view-indent-inword",
      };
    }
	else if (taskId.includes('IND')) {
      return {
        INITIATED: "/egov-store-asset/view-indent",
        DEFAULT: "/egov-store-asset/view-indent",
      };

    } else if (taskId.includes('PO')) {
      return {
        INITIATED: "/egov-store-asset/view-purchase-order",
        DEFAULT: "/egov-store-asset/view-purchase-order",
      };

    } else if (taskId.includes('MMRN')) {
      return {
        INITIATED: "/egov-store-asset/view-material-receipt-note-misc",
        DEFAULT: "/egov-store-asset/view-material-receipt-note-misc",
      };

    } else if (taskId.includes('TRIN')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-transfer",
        DEFAULT: "/egov-store-asset/view-indent-transfer",
      };

    }
    else if (taskId.includes('MRN')) {
      return {
        INITIATED: "/egov-store-asset/view-material-receipt-note",
        DEFAULT: "/egov-store-asset/view-material-receipt-note",
      };

    }
    else if (taskId.includes('MROW')) {
      return {
        INITIATED: "/egov-store-asset/view-indent-outword",
        DEFAULT: "/egov-store-asset/view-indent-outword",
      };
    }
	else if (taskId.includes('OPB')) {
      return {
        INITIATED: "/egov-store-asset/view-opening-balence",
        DEFAULT: "/egov-store-asset/view-opening-balence",
      };
    }

    else if (businessService == "PAYMENT WORKFLOW" || businessService == "FINE MASTER APPROVAL" || businessService == "CHALLAN WORKFLOW" || businessService == "AUCTION WORKFLOW") {
      switch (businessService) {
        case "CHALLAN WORKFLOW":
          return {
            INITIATED: "/egov-echallan/search-preview",
            DEFAULT: "/egov-echallan/search-preview",
          };
        case "AUCTION WORKFLOW":
          return {
            INITIATED: "/egov-echallan-auction/search-preview",
            DEFAULT: "/egov-echallan-auction/search-preview",
          };
        case "FINE MASTER APPROVAL":
          return {
            INITIATED: "/egov-echallan-fine-master/search",
            DEFAULT: "/egov-echallan-fine-master/search",
          };
        case "PAYMENT WORKFLOW":
          return {
            INITIATED: "/egov-echallan/search-preview",
            DEFAULT: "/egov-echallan/search-preview",
          };
        default:
          break;
      }
    }
    else if (businessService == "PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS" || businessService == "PRUNING OF TREES GIRTH GREATER THAN 90 CMS" || businessService == "REMOVAL OF GREEN TREES" || businessService == "REMOVAL OF DEAD/DANGEROUS/DRY TREES") {
      return {
        INITIATED: "/egov-hc/search-preview",
        DEFAULT: "/egov-hc/search-preview",
      };
    }
    // new module rediraection for case "RRP_SERVICE ,DOE_SERVICE, DOP_SERVICE" Chnage
    else if (businessService == "RRP_SERVICE" || businessService == "DOE_SERVICE" || businessService == "DOP_SERVICE") {
      // return {
      //   INITIATED: "/pms/pmsmap",
      //   DEFAULT: "/pms/pmsmap",
      // };
      if(businessService == "DOE_SERVICE")
      {
        return {
          INITIATED: "/pms/doeDetails",
          DEFAULT: "/pms/doeDetails",
        };

      }
      else if(businessService == "DOP_SERVICE")
      {
        //doeDetails
        return {
          INITIATED: "/pms/dopDetails",
          DEFAULT: "/pms/dopDetails",
        };
      }
      else if(businessService == "RRP_SERVICE")
      {
        //doeDetails
        return {
          INITIATED: "/pms/rrpDetails",
          DEFAULT: "/pms/rrpDetails",
        };
      }
     
    }
  }
  else if (businessService == "PAYMENT WORKFLOW" || businessService == "FINE MASTER APPROVAL" || businessService == "CHALLAN WORKFLOW" || businessService == "AUCTION WORKFLOW") {
    switch (businessService) {
      case "CHALLAN WORKFLOW":
        return {
          INITIATED: "/egov-echallan/search-preview",
          DEFAULT: "/egov-echallan/search-preview",
        };
      case "AUCTION WORKFLOW":
        return {
          INITIATED: "/egov-echallan-auction/search-preview",
          DEFAULT: "/egov-echallan-auction/search-preview",
        };
      case "FINE MASTER APPROVAL":
        return {
          INITIATED: "/egov-echallan-fine-master/search",
          DEFAULT: "/egov-echallan-fine-master/search",
        };
      case "PAYMENT WORKFLOW":
        return {
          INITIATED: "/egov-echallan/search-preview",
          DEFAULT: "/egov-echallan/search-preview",
        };
      default:
        break;
    }
  }
  else if (businessService == "PRUNING OF TREES GIRTH LESS THAN OR EQUAL TO 90 CMS" || businessService == "PRUNING OF TREES GIRTH GREATER THAN 90 CMS" || businessService == "REMOVAL OF GREEN TREES" || businessService == "REMOVAL OF DEAD/DANGEROUS/DRY TREES") {
    return {
      INITIATED: "/egov-hc/search-preview",
      DEFAULT: "/egov-hc/search-preview",
    };
  }
  // new module rediraection for case "RRP_SERVICE ,DOE_SERVICE, DOP_SERVICE" Chnage
  else if (businessService == "RRP_SERVICE" || businessService == "DOE_SERVICE" || businessService == "DOP_SERVICE") {
    // return {
    //   INITIATED: "/pms/pmsmap",
    //   DEFAULT: "/pms/pmsmap",
    // };
    if(businessService == "DOE_SERVICE")
    {
      return {
        INITIATED: "/pms/doeDetails",
        DEFAULT: "/pms/doeDetails",
      };

    }
    else if(businessService == "DOP_SERVICE")
    {
      //doeDetails
      return {
        INITIATED: "/pms/dopDetails",
        DEFAULT: "/pms/dopDetails",
      };
    }
    else if(businessService == "RRP_SERVICE")
    {
      //doeDetails
      return {
        INITIATED: "/pms/rrpDetails",
        DEFAULT: "/pms/rrpDetails",
      };
    }
  }
  else if (businessService == "OSBM")
  {
    return {
      DEFAULT: "/egov-services/application-details",
    }
  }
  
  else if (businessService == "BWT")
  {
    return {
      DEFAULT: "/egov-services/bwt-application-details",
    } 
  }
else if (businessService == "NLUJM")
  {
    return {
      DEFAULT: "/egov-services/newLocation-application-details",
    } 
  }
  else if (businessService == "OSUJM")
  {
    return {
      DEFAULT: "/egov-services/osmcc-application-details",
    } 
  }
  else if (businessService == "PACC")
  {
    return { 
      DEFAULT: "/egov-services/park-and-community-center-appDetails-details",
    } 
  }
  else if (businessService == "GFCP")
  {
    return { 
      DEFAULT: "/egov-services/cg-application-details",
    } 
  }


   else if (businessService == "NewTL") { 
    return {
      INITIATED: "/tradelicence/apply",
      DEFAULT: "/tradelicence/search-preview",
    };

  }
  else if (businessService == "REGULARWSCONNECTION"
          || businessService == "TEMPORARY_WSCONNECTION"
          || businessService == "WS_TEMP_TEMP"
          || businessService == "WS_TEMP_REGULAR"
          || businessService == "WS_DISCONNECTION"
          || businessService == "WS_TEMP_DISCONNECTION"
          || businessService == "WS_RENAME"
          || businessService == "WS_METER_UPDATE"
          || businessService == "WS_CONVERSION"
          || businessService == "WS_REACTIVATE"
          || businessService == "SW_SEWERAGE"   
          || businessService == "WS_TUBEWELL") { 
    return {
      INITIATED: "/wns/search-preview",
      DEFAULT: "/wns/search-preview",
    };

  }

  else {
    switch (module.toUpperCase()) {
      case "TL-SERVICES":
      if(businessService === "MasterRP") {
        return {
          INITIATED: "/rented-properties/apply",
          DEFAULT: "/rented-properties/search-preview",
        };
      } else if(businessService === "OwnershipTransferRP") {
        return {
          INITIATED: "/rented-properties/ownership-search-preview",
          DEFAULT: "/rented-properties/ownership-search-preview",
        };
      } else if(businessService === "DuplicateCopyOfAllotmentLetterRP") {
        return {
          INITIATED: "/rented-properties/search-duplicate-copy-preview",
          DEFAULT: "/rented-properties/search-duplicate-copy-preview",
        };
      } else if(businessService === "PermissionToMortgage") {
        return {
          INITIATED: "/rented-properties/mortgage-search-preview",
          DEFAULT: "/rented-properties/mortgage-search-preview",
        };
      }
    case "RENTEDPROPERTIES": 
      if(businessService === "MasterRP") {
      return {
        INITIATED: "/rented-properties/apply",
        DEFAULT: "/rented-properties/search-preview",
      };
    } else if(businessService === "OwnershipTransferRP") {
      return {
        INITIATED: "/rented-properties/ownership-search-preview",
        DEFAULT: "/rented-properties/ownership-search-preview",
      };
    } else if(businessService === "DuplicateCopyOfAllotmentLetterRP") {
      return {
        INITIATED: "/rented-properties/search-duplicate-copy-preview",
        DEFAULT: "/rented-properties/search-duplicate-copy-preview",
      };
    } else if(businessService === "PermissionToMortgage") {
      return {
        INITIATED: "/rented-properties/mortgage-search-preview",
        DEFAULT: "/rented-properties/mortgage-search-preview",
      };
    }
    case "ESTATEBRANCH":
    case "BUILDINGBRANCH":
    case "MANIMAJRA":
    case "ESTATEPROPERTIES":
      case  "ESTATESERVICES":
      if(businessService === "ES-EB-AllotmentOfSite" || businessService === "ES-EB-PropertyMaster") {
        return {
          INITIATED: 'estate/search-preview',
          DEFAULT: 'estate/search-preview'
        }
      } 
      else if (businessService === "ES-BB-PropertyMaster") {
        return {
          INITIATED: 'estate/search-preview-building-branch',
          DEFAULT: 'estate/search-preview-building-branch'
        }
      }
      else if (businessService === "ES-MM-PropertyMaster") {
        return {
          INITIATED: 'estate/search-preview-manimajra',
          DEFAULT: 'estate/search-preview-manimajra'
        }
      }
      else if(businessService === "ES-EB-IS-RefundOfEmd"){
        return {
          INITIATED: 'estate/refund',
          DEFAULT:'estate/refund'
        }
      }
      else {
        return {
          INITIATED: "/estate/preview",
          DEFAULT: "/estate/preview"
        }
      }

     case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
      case "FIRENOC":
        return {
          INITIATED: "/fire-noc/apply",
          DEFAULT: "/fire-noc/search-preview",
        };
		
		// case "MCC-BOOKING-NEW-LOCATION":
		// return {	
		// 	DEFAULT: "/egov-services/newLocation-application-details", 
		// 	}
		 
		
    //     case "BOOKING-SERVICES":
    //       return {
    //         DEFAULT: "/egov-services/application-details",
    //       }
		 
    //     case "WATER-TANKER-SERVICES":
    //       return {
    //         DEFAULT: "/egov-services/bwt-application-details",
    //       }
        case "HORTICULTURE":
          return {
            INITIATED: "/egov-hc/search-preview",
            DEFAULT: "/egov-hc/search-preview",
          };
        
      case "BPA-SERVICES":
        return {
          INITIATED: "/egov-bpa/search-preview",
          DEFAULT: "/egov-bpa/search-preview",
        };
      case "BPAREG":
        return {
          DEFAULT: "/bpastakeholder/search-preview",
        };
      case "PT-SERVICES":
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        };
      case "PT":
        if (businessService == "PT.CREATE") {
          return {
            INITIATED: "/property-tax/application-preview",
            DEFAULT: "/property-tax/application-preview",
          };
        } else {
          return {
            INITIATED: "/pt-mutation/search-preview",
            DEFAULT: "/pt-mutation/search-preview",
          };
        }
    }
  }
};
