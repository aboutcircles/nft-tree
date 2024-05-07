import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {
  class TreeData extends Model {
    declare nftIds: string;
    declare crcAmount: string;
    declare address: string;
    declare username: string;
    declare imageUrl: string;
    declare steps: string;
  }

  TreeData.init(
    {
      nftIds: DataTypes.TEXT,
      crcAmount: DataTypes.STRING,
      address: DataTypes.STRING,
      username: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      steps: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "TreeData",
      timestamps: false,
      tableName: "treeData",
    }
  );

  return TreeData;
};
