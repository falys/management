<template>
    <div>

        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="handleAdd"  v-if="buttons.indexOf('memberAdd')!==-1">添加成员</el-button>
            </div>
            <el-table
                    :data="list"
                    border
                    class="table"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="userid" label="用户ID" width="180" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"  align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号码"  align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                                v-if="buttons.indexOf('memberDelete')!==-1"

                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="dialogShow" width="20%">
            <el-form :model="formData" :rules="rules" ref="rolesUserForm" label-position="right" label-width="100px">
                <el-form-item label="选择用户" prop="mobile">
                    <el-autocomplete
                            v-model="formData.mobile"
                            :fetch-suggestions="handleSearch"
                            placeholder="输入手机号检索用户"
                            @select="handleUserSelect"
                            @clear="initMobileVerify"
                            clearable>
                    </el-autocomplete>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">取 消</el-button>
                <el-button type="primary" @click="handeleSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { userSearch } from '@/api/user';
    import { roleMemberAdd, roleMemberList, roleMemberDelete } from '../../api/permission';

    export default {
        name: 'basetable',
        data() {
            return {
                buttons: [],
                pageTotal: 0,
                list: [],
                dialogShow: false,
                // 表单结构
                formData: {userid:'',roleid: ''},
                // 表单验证
                rules: {
                    mobile: [
                        {required: true, message: '选择用户', trigger: 'blur', validator:this.autocompleteVerify },
                    ],
                },
            };
        },
        created() {
            this.getList()
            this.buttons =  this.$store.state.permission.buttons
        },
        methods: {
            getList() {
                const data = {}
                data.roleid = sessionStorage.getItem('roleId')
                roleMemberList(data).then(response => {
                    if(response.data) {
                        this.list = response.data
                    }
                })
            },
            handleAdd() {
              this.dialogShow = true
            },
            // 搜索用户
            async handleSearch(qs, cb) {
                if(qs) {
                    const data = {}
                    data.mobile = qs
                    userSearch(data).then(response => {
                        if(response.data){
                            cb(response.data)
                        }
                    })
                }
            },
            // 处理搜索结果的选中
            handleUserSelect(item) {
                this.formData.userid = item.userid
                if (this.formData.userid) {
                    this.$refs['rolesUserForm'].validateField('mobile')
                }
            },
            // 初始化验证
            initMobileVerify() {
                this.formData.userid = ''
                this.$refs['rolesUserForm'].validateField('mobile')
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    const data = {}
                    data.userid = row.userid
                    data.roleid = row.roleid
                    roleMemberDelete(data).then(response => {
                        if (response.code === 0) {
                            this.$message({
                                title: '成功',
                                message: '操作成功！',
                                type: 'success',
                                duration: 3000
                            })
                            this.dialogShow = false
                            this.getList()
                        }
                    })
                }).catch(() => {

                });
            },
            // 搜索用户，自动补全验证
            autocompleteVerify(rule, value, callback) {
                if (rule.required && (!this.formData.userid || !this.formData.mobile) ) {
                    callback(new Error(rule.message))
                }
                callback()
            },
            handeleSave() {
                this.formData.roleid = sessionStorage.getItem('roleId')
                roleMemberAdd(this.formData).then(response => {
                    if (response.code === 0) {
                        this.$message({
                            title: '成功',
                            message: '操作成功！',
                            type: 'success',
                            duration: 3000
                        })
                        this.dialogShow = false
                        this.getList()
                    }
                })
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
