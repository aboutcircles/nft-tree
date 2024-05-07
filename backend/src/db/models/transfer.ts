import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {
  class Transfer extends Model {
    declare transactionHash: string;
    declare fromAddress: string;
    declare toAddress: string;
    declare timestamp: string;
    declare amount: string;
    declare crcAmount: string;
    declare blockNumber: string;
    declare nftAmount: number;
    declare nftMinted: number;
    declare processed: boolean;
    declare cancelled: boolean;
  }

  Transfer.init(
    {
      transactionHash: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      fromAddress: DataTypes.STRING,
      toAddress: DataTypes.STRING,
      timestamp: DataTypes.STRING,
      amount: DataTypes.STRING,
      crcAmount: DataTypes.STRING,
      blockNumber: DataTypes.STRING,
      nftAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      nftMinted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      processed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "transfer",
      timestamps: false,
      tableName: "transfers",
    }
  );

  return Transfer;
};
