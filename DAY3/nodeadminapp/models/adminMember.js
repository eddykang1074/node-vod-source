module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      'admin_member',
      {
          admin_member_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          comment: '관리자계정 고유번호',
        },
        company_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '회사코드',
        },
        admin_id: {
          type: DataTypes.STRING(100),
          allowNull: false,
          comment: '관리자계정 아이디',
        },
        admin_password: {
          type: DataTypes.STRING(500),
          allowNull: false,
          comment: '관리자의 난독화된 해시암호문자열',
        },
        admin_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          comment: '관리자명',
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '메일주소',
          },
        telephone: {
          type: DataTypes.STRING(100),
          allowNull: true,
          comment: '전화번호',
        },
        dept_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: '부서명',
        },
        used_yn_code: {
          type: DataTypes.TINYINT,
          allowNull: false,
          comment: '이용상태 0:허용대기 1:사용중 2:탈퇴처리',
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
        tableName: 'admin_member',
        timestamps: false,
        comment: '관리자계정정보',
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'admin_member_id' }],
          },
        ],
      }
     );
  };
