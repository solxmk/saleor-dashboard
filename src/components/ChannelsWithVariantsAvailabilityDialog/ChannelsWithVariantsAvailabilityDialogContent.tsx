import {
  Avatar,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  makeStyles,
  Typography
} from "@material-ui/core";
import { ChannelData } from "@saleor/channels/utils";
import IconChevronDown from "@saleor/icons/ChevronDown";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ChannelsWithVariantsData } from "@saleor/products/views/ProductUpdate/types";
import map from "lodash-es/map";
import React, { ChangeEvent } from "react";
import { defineMessages, useIntl } from "react-intl";

import ControlledCheckbox from "../ControlledCheckbox";

const useStyles = makeStyles(
  theme => ({
    variantContainer: {
      padding: theme.spacing(2, 1, 1, 4)
    },
    channelContainer: {
      width: "100%"
    },
    channelCheckboxContainer: {
      width: "100%",
      paddingBottom: theme.spacing(1)
    },
    channelTitleContainer: {
      display: "flex",
      flexDirection: "column"
    },
    variantTitleContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }),
  { name: "ChannelsWithVariantsAvailabilityDialogContent" }
);

const useExpanderStyles = makeStyles(
  () => ({
    expanded: {},
    root: {
      boxShadow: "none",

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ChannelsWithVariantsAvailabilityExpander" }
);

const useSummaryStyles = makeStyles(
  theme => ({
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      margin: 0,
      minHeight: 0,

      "&$expanded": {
        minHeight: 0
      }
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0
      }
    }
  }),
  { name: "ChannelsWithVariantsAvailabilityChannelSummary" }
);

const messages = defineMessages({
  variantsSelectedLabel: {
    defaultMessage: "{variantsAmount} variants selected",
    description: "variants selected label"
  }
});

interface ChannelsWithVariantsAvailabilityDialogContentProps {
  addVariantToChannel: (channelId: string, variantId: string) => void;
  removeVariantFromChannel: (channelId: string, variantId: string) => void;
  channelsWithVariants: ChannelsWithVariantsData;
  toggleAllChannelVariants: (channelId: string) => () => void;
  isChannelSelected: (channelId: string) => boolean;
  channels: ChannelData[];
  allVariants: ProductDetails_product_variants[];
}

const ChannelsWithVariantsAvailabilityDialogContent: React.FC<ChannelsWithVariantsAvailabilityDialogContentProps> = ({
  channelsWithVariants,
  addVariantToChannel,
  removeVariantFromChannel,
  toggleAllChannelVariants,
  isChannelSelected,
  channels,
  allVariants
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const expanderClasses = useExpanderStyles({});
  const summaryClasses = useSummaryStyles({});

  const handleVariantChange = (channelId: string, variantId: string) => (
    event: ChangeEvent<any>
  ) =>
    event.target.value
      ? addVariantToChannel(channelId, variantId)
      : removeVariantFromChannel(channelId, variantId);

  return (
    <>
      {map(channelsWithVariants, ({ selectedVariantsIds }, channelId) => {
        const { name } = channels.find(getById(channelId));

        const isVariantSelected = (variantId: string) =>
          selectedVariantsIds.includes(variantId);

        const getVariantThumbnailSrc = (variantId: string) =>
          allVariants.find(getById(variantId)).media[0].url;

        return (
          <ExpansionPanel classes={expanderClasses}>
            <ExpansionPanelSummary
              expandIcon={<IconChevronDown />}
              classes={summaryClasses}
            >
              <div className={classes.channelContainer}>
                <div className={classes.channelCheckboxContainer}>
                  <ControlledCheckbox
                    checked={isChannelSelected(channelId)}
                    name={name}
                    label={
                      <div className={classes.channelTitleContainer}>
                        <Typography>{name}</Typography>
                        <Label
                          text={intl.formatMessage(
                            messages.variantsSelectedLabel,
                            {
                              variantsAmount: selectedVariantsIds.length
                            }
                          )}
                        />
                      </div>
                    }
                    onChange={event => {
                      toggleAllChannelVariants(channelId)();
                    }}
                  />
                </div>
                <Divider />
              </div>
            </ExpansionPanelSummary>
            {allVariants.map(({ id: variantId, name }) => (
              <>
                <div
                  key={variantId}
                  className={classes.variantContainer}
                  data-test-id="channel-row"
                >
                  <ControlledCheckbox
                    checked={isVariantSelected(variantId)}
                    name={name}
                    label={
                      <div className={classes.variantTitleContainer}>
                        <Avatar src={getVariantThumbnailSrc(variantId)} />
                        <Typography>{name}</Typography>
                      </div>
                    }
                    onChange={handleVariantChange(channelId, variantId)}
                  />
                </div>
                <Divider />
              </>
            ))}
          </ExpansionPanel>
        );
      })}
    </>
  );
};

export default ChannelsWithVariantsAvailabilityDialogContent;