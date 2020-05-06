<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        class="handle-del mr10"
                        @click="handleAdd"
                        v-if="buttons.indexOf('rolesAdd')!==-1"
                >添加角色</el-button>
            </div>
            <el-table
                    :data="list"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="roleId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="displayName" label="角色标识"></el-table-column>
                <el-table-column prop="description" label="备注" align="center"></el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleAddMember(scope.row)"
                                v-if="buttons.indexOf('rolesBinding')!==-1"
                        >用户绑定</el-button>
                        <el-button
                                type="text"
                                @click="hnadleAssignPermission(scope.row)"

                        >权限分配</el-button>
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                                v-if="buttons.indexOf('rolesEdit')!==-1"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                                v-if="buttons.indexOf('rolesDelete')!==-1"
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
        <!-- 权限分配抽屉-->
        <el-drawer :visible.sync="drawer">
            <div class="drawer-panel">
                <div class = "drawer-title">为{{roleName}}分配权限</div>
                <el-table
                        :data="permissions"
                        border
                        style="width: 100%">
                    <el-table-column width="120">
                        <template slot-scope="scope"  >
                            <el-checkbox-group v-model="checkedNode">
                                <el-checkbox :label="scope.row.permissionId" >{{scope.row.displayName}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <el-checkbox-group v-if="scope.row.children" v-model="checkedNode">
                                <div v-for="node in scope.row.children">
                                    <dl>
                                        <dt>
                                            <el-checkbox  :label="node.permissionId" :key="node.permissionId">{{node.displayName}}</el-checkbox>
                                        </dt>
                                        <dd v-if="node.children" class="ml20">
                                            <el-checkbox v-for="node1 in node.children"  :label="node1.permissionId" :key="node1.permissionId">{{node1.displayName}}</el-checkbox>
                                        </dd>
                                    </dl>
                                </div>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin: 20px 0;width: 100%;text-align: center">
                    <el-button class="green-btn w-100" size="small" type="primary" @click="handleAssign" >分配权限</el-button>
                </div>
            </div>

        </el-drawer>
        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="25%">
            <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="70px">
                <el-input type="hidden" v-model="roleForm.roleId"></el-input>
                <el-form-item label="角色名称">
                    <el-input v-model="roleForm.name" :readonly="disabled"></el-input>
                </el-form-item>
                <el-form-item label="角色标志">
                    <el-input v-model="roleForm.displayName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="roleForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">取 消</el-button>
                <el-button type="primary" @click="roleSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getRolelist, getPermissionList, getRolesPermission, roleCreate, roleUpdate, roleDelete, assingPermissin } from '@/api/permission'
    import { array_diff } from '@/utils';
    export default {
        name: 'roles',
        data() {
            return {
                buttons: [],
                query: {
                    name: '',
                    nickname: '',
                    mobile: '',
                    page: 1,
                    pageSize: 10
                },
                pageTotal: 0,
                list: [],
                dialogTitle: '',
                dialogShow: false,
                disabled: false,
                roleForm: {
                    roleId: '',
                    name: '',
                    displayName: '',
                    description: '',
                },
                roleRules: {
                    name: [{ required: true, message: '请输入用角色名称(2-15字符)', trigger: 'blur' },
                        { min: 2, max: 15, message: '请输入角色名称(2-15字符)', trigger: 'blur' }],
                    displayName: [{ required: true, message: '角色标识', trigger: 'blur' }],

                },
                drawer: false,
                roleName: '',
                permissions: [],
                checkedNode: [],
                oldCheckNode: [],
                assignRole: ''

            };
        },
        created() {
            this.getList();
            this.getPermissions()
            this.buttons =  this.$store.state.permission.buttons
        },
        methods: {
            getList() {
                getRolelist(this.query).then(res => {
                    if(res.data.list) {
                        this.list = res.data.list
                        this.pageTotal = res.data.total
                    }
                })
            },
            getPermissions() {
                getPermissionList().then(res => {
                    if(res.data) {
                        this.permissions = res.data
                    }
                })
            },
            //添加
            handleAdd() {
                this.disabled = false
                this.dialogTitle = '添加角色'
                this.dialogShow = true
                this.roleForm.roleId = ''
                this.roleForm.name = ''
                this.roleForm.displayName = ''
                this.roleForm.description = ''
            },
            // 编辑操作
            handleEdit(index, row) {
                this.disabled = true
                this.dialogTitle = '编辑用户'
                this.dialogShow = true
                this.roleForm.roleId = row.roleId
                this.roleForm.name = row.name
                this.roleForm.displayName = row.displayName
                this.roleForm.description = row.description
            },
            //分配权限
            hnadleAssignPermission(row) {
                this.assignRole = row.roleId
                this.roleName = row.displayName
                this.drawer = true
                const data = {}
                data.roleId = row.roleId
                getRolesPermission(data).then(res => {
                    if(res.data) {
                        this.checkedNode = res.data
                        this.oldCheckNode = res.data
                    }
                })
            },
            roleSave() {
                this.$refs.roleForm.validate(valid => {
                    if (valid) {
                        if(this.roleForm.roleId) {
                            roleUpdate(this.roleForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.roleForm.resetFields()
                                }
                            })
                        } else {
                            roleCreate(this.roleForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.roleForm.resetFields()
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
                }).then(() => {
                        const data = {}
                        data.roleId = row.roleId
                        roleDelete(data).then(response => {
                            if (response.code === 0) {
                                this.$message.success('删除成功');
                                this.getList()
                            }
                        })
                }).catch(() => {});
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getList();
            },
            handleAddMember(row) {
                sessionStorage.setItem('roleId', row.roleId)
                this.$router.push('/roles/member')
            },
            handleAssign() {
                const data = {}
                data.roleId = this.assignRole
                data.permissions = this.checkedNode
                data.old = this.oldCheckNode
                assingPermissin(data).then(res => {
                    if (res.code === 0) {
                        this.$message.success('分配成功');
                        this.drawer = false
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
        font-size: 16px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .ml20 {
        margin-left: 20px;
    }
    .drawer-title {
        font-size: 20px;
        color: #333;
        padding: 20px 0;
    }
    .drawer-panel {
        padding: 20px 40px 20px;
    }
    .drawer-item {
        margin-top: 20px;
    }
    .check-children {
        margin:20px 0 0 20px;
    }

</style>
