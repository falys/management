<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="mr10" @click="handleAdd" v-if="buttons.indexOf('userAdd')!==-1">新增用户</el-button>
                <!-- <el-input v-model="query.keyword" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
            </div>
            <el-table
                    :data="list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column label="昵称" align="center">
                    <template slot-scope="scope">{{scope.row.nickname}}</template>
                </el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.thumb"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" align="center">
                    <template slot-scope="scope">{{scope.row.mobile}}</template>
                </el-table-column>
                <el-table-column label="邮箱" align="center">
                    <template slot-scope="scope">{{scope.row.email}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.status===1 ?'success':(scope.row.status==='0'?'danger':'')"
                        >{{scope.row.statusStr}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createAt" label="注册时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEnable(scope.row)"
                                v-if="buttons.indexOf('userEnableDisable')!==-1"
                        >{{scope.row.status===1? '禁用': '启用'}}</el-button>
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                                v-if="buttons.indexOf('userEdit')!==-1"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                class="red" @click="handleDelete(scope.$index, scope.row)"
                                v-if="buttons.indexOf('userDelete')!==-1"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogShow"  width="25%">
            <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="120px">
                <el-input type="hidden" v-model="userForm.userid"></el-input>
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="昵称"  prop="nickname" >
                    <el-input size="small" v-model="userForm.nickname" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码"  prop="mobile
" >
                    <el-input size="small" v-model="userForm.mobile" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址"  prop="email" >
                    <el-input size="small" v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item v-if="isAdd" label="登录密码" prop="password" >
                    <el-input type="password"  size="small" placeholder="请输入密码"  v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item v-if="isAdd" label="确认密码" prop="checkPass" >
                    <el-input type="password"  size="small" placeholder="确认密码" v-model="userForm.checkPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">取 消</el-button>
                <el-button type="primary" @click="userSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getUserlist, userCreate, userUpdate, userDelete} from '@/api/user'
    import { validateMobile } from '@/utils/validate'

    export default {
        name: 'user',
        data() {
            const validatePhone = (rule, value, callback) => {
                if (!validateMobile(value)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.userForm.checkPassword !== '') {
                        this.$refs.userForm.validateField('checkPassword')
                    }
                    callback()
                }
            }
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.userForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                buttons: [],
                query: {
                    keyword: '',
                    mobile: '',
                    page: 1,
                    pageSize: 10
                },
                pageTotal: 0,
                list: [],
                isAdd: true,
                dialogTitle: '',
                dialogShow: false,
                userForm: {
                    userid: '',
                    username: '',
                    nickname: '',
                    mobile: '',
                    email: '',
                    password: '',
                    checkPassword: ''
                },
                userRules: {
                    username: [{ required: true, message: '请输入用户名(2-15字符)', trigger: 'blur' },
                        { min: 2, max: 15, message: '请输入用户名(2-15字符)', trigger: 'blur' }],
                    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                    mobile: [{  message: '请输入正确的手机号', trigger: 'blur', validator: validatePhone }],
                    email: [{ type: 'email',  message: '请输入正确的邮箱地址', trigger: 'blur' }],
                    password: [{ required: true, trigger: 'blur', validator: validatePass }],
                    checkPassword: [{ required: true, trigger: 'blur', validator: validatePass1 }]
                },
            };
        },
        created() {
            this.buttons =  this.$store.state.permission.buttons
            this.getList();
        },
        methods: {
            getList() {
                getUserlist(this.query).then(res => {
                    if(res.data.list) {
                        this.list = res.data.list
                        this.pageTotal = res.data.total
                    }
                })
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getList();
            },
            handleAdd() {
                this.dialogTitle = '添加用户'
                this.dialogShow = true
                this.isAdd = true
                this.userForm.userid = ''
                this.userForm.username = ''
                this.userForm.nickname = ''
                this.userForm.mobile = ''
                this.userForm.email = ''
                this.userForm.password = ''
                this.userForm.checkPass = ''
            },
            // 编辑操作
            handleEdit(index, row) {
                this.dialogTitle = '编辑用户'
                this.dialogShow = true
                this.isAdd = false
                this.userForm.userid = row.userid
                this.userForm.username = row.username
                this.userForm.nickname = row.nickname
                this.userForm.mobile = row.mobile
                this.userForm.email = row.email
                this.dialogShow = true;
            },
            handleEnable(row) {

            },
            userSave() {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        if(this.userForm.userid) {
                            userUpdate(this.userForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.userForm.resetFields()
                                }
                            })
                        } else {
                            userUpdate(this.userForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.userForm.resetFields()
                                }
                            })
                        }
                    }
                })
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const data = {}
                        data.userid = row.userid
                        userDelete(data).then(response => {
                            if (response.code === 0) {
                                this.$message.success('删除成功');
                                this.getList()
                            }
                        })
                    })
                    .catch(() => {});
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getList();
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
