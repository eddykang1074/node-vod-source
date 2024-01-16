

module.exports = function(sequelize,DataTypes){

    return sequelize.define('channel',
    {
        channel_id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false,
            comment:'채널 고유번호'
        },
        community_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '커뮤니티 고유번호 기본값:1',
        },
        category_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '채널분류코드 0:그룹채널 1:일대일전용채널',
        },
        channel_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '채널명',
        },
        user_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '접속자 제한수',
        },
        channel_img_path: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: '채널 대표 이미지 경로',
        },
        channel_desc: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: '채널설명',
        },
        channel_state_code: {
            type: DataTypes.TINYINT,
            allowNull: false,
            comment: '채널 사용상태 0:사용안함 1:사용함',
        },
        reg_date: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: '등록일시',
        },
        reg_member_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '등록자고유번호',
        },
        edit_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '수정일시',
        },
        edit_member_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '수정자고유번호',
        }
    },
    {
        sequelize,
        tableName: 'channel',
        timestamps: false,
        comment: '채널정보',
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'channel_id' }],
          },
        ],
      }
    );
    }