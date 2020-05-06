<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="handleAdd" v-if="buttons.indexOf('permissionAdd')!==-1" >添加权限组</el-button>
            </div>
            <el-table
                    :data="list"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="permissionId"
                    border
                    default-expand-all
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                        prop="name"
                        label="权限名称"
                        align="left"
                        width="250"
                        >
                </el-table-column>
                <el-table-column
                        prop="displayName"
                        label="权限标志"
                        align="center"
                        >
                </el-table-column>
                <el-table-column
                        prop="effectUri"
                        label="作用路由"
                        align="center"
                        >
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="备注"
                        align="center"
                        >
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleAddChild(scope.row)"
                                v-if="buttons.indexOf('permissionAdd')!==-1"
                        >添加权限</el-button>
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                                v-if="buttons.indexOf('permissionEdit')!==-1"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                                v-if="buttons.indexOf('permissionDelete')!==-1"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="25%">
            <el-form ref="permissionForm" :model="permissionForm" :rules="permissionRules" label-width="120px">
                <el-input type="hidden" v-model="permissionForm.permissionId"></el-input>
                <el-form-item label="权限名称">
                    <el-input v-model="permissionForm.name" :readonly="disabled"></el-input>
                </el-form-item>
                <el-form-item label="权限标志">
                    <el-input v-model="permissionForm.displayName"></el-input>
                </el-form-item>
                <el-form-item label="作用路由">
                    <el-input v-model="permissionForm.effectUri"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="permissionForm.isNav" placeholder="类型" class="handle-select" @change="handleChange">
                        <el-option v-for="item in navOptions" :key="item.key" :label="item.text" :value="item.key" />
                        <!--<el-option key="1" label="导航" value="1"></el-option>-->
                        <!--<el-option key="0" label="按钮" value="0"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="展示导航" v-if="permissionForm.isNav==1">
                    <el-select v-model="permissionForm.hidden" placeholder="展示导航" class="handle-select">
                        <el-option v-for="item in hiddenOptions" :key="item.key" :label="item.text" :value="item.key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="permissionForm.description"></el-input>
                </el-form-item>
                <el-form-item label="导航图标">
                    <el-input v-model="permissionForm.icon" readonly=""></el-input>
                    <ul>
                        <li class="icon-li" v-for="(item,index) in icons" :key="index">
                            <div v-bind:class="currIndex === index ? 'icon-li-content active':'icon-li-content'" class="" @click="handleIconCheck(index,item)">
                                <i :class="`el-icon-${item}`"></i>
                                <span>el-icon-{{item}}</span>
                            </div>
                        </li>
                    </ul>
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
    import { getPermissionList, permissionCreate, permissionUpdate, permissionDelete } from '../../api/permission';
    export default {
        name: 'nodes',
        data() {
            return {
                buttons: [],
                list: [],
                disabled: false,
                dialogTitle: '',
                dialogShow: false,
                permissionForm: {
                    parentId: 0,
                    permissionId: '',
                    name: '',
                    displayName: '',
                    effectUri: '',
                    isNav: 0,
                    icon: 0,
                    hidden: 0,
                    description:''
                },
                currIndex: 0,
                permissionRules: {
                    name: [{ required: true, message: '请输入用角色名称(2-15字符)', trigger: 'blur' },
                        { min: 2, max: 15, message: '请输入角色名称(2-15字符)', trigger: 'blur' }],
                    displayName: [{ required: true, message: '角色标识', trigger: 'blur' }],

                },
                icons: [
                    's-home',
                    'user-solid',
                    'setting',
                    's-goods',
                    's-help',
                    'film',
                    's-order'
                ],
                navOptions: [
                    { key: 1, text: '导航' },
                    { key: 0, text: '按钮' }
                ],
                hiddenOptions: [
                    { key: 0, text: '否' },
                    { key: 1, text: '是' }
                ]
            };
        },
        created() {
            this.buttons =  this.$store.state.permission.buttons
            this.getList();
        },
        methods: {
            handleIconCheck(index, item) {
                this.permissionForm.icon = 'el-icon-' + item
                this.currIndex = index
            },
            // 获取 easy-mock 的模拟数据
            getList() {
                getPermissionList().then(res => {
                    if(res.data) {
                        this.list = res.data
                    }
                })
            },
            // 编辑操作
            handleAdd() {
                this.dialogTitle = '添加权限组'
                this.dialogShow = true
                this.permissionForm.permissionId = ''
                this.permissionForm.name = ''
                this.permissionForm.isNav = ''
                this.permissionForm.icon = ''
                this.permissionForm.effectUri =''
                this.permissionForm.displayName = ''
                this.permissionForm.description = ''
            },
            handleAddChild(row) {
                this.dialogTitle = '添加权限组'
                this.dialogShow = true
                this.permissionForm.permissionId = ''
                this.permissionForm.parentId = row.permissionId
                this.permissionForm.name = ''
                this.permissionForm.isNav = ''
                this.permissionForm.icon = ''
                this.permissionForm.effectUri = ''
                this.permissionForm.displayName = ''
                this.permissionForm.description = ''
            },
            // 编辑操作
            handleEdit(index, row) {
                console.log(row)
                this.dialogTitle = '编辑权限'
                this.dialogShow = true
                this.permissionForm.permissionId = row.permissionId
                this.permissionForm.name = row.name
                this.permissionForm.isNav = row.isNav
                this.permissionForm.icon = row.icon
                this.permissionForm.effectUri = row.effectUri
                this.permissionForm.displayName = row.displayName
                this.permissionForm.description = row.description
                for(var i=0; i < this.icons.length; i++) {
                    const item = 'el-icon-' + this.icons[i]
                    console.log(item)
                    if(row.icon === item) {
                        this.currIndex = i
                        break;
                    }
                }
            },
            roleSave() {
                this.$refs.permissionForm.validate(valid => {
                    if (valid) {
                        if(this.permissionForm.permissionId) {
                            permissionUpdate(this.permissionForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.permissionForm.resetFields()
                                }
                            })
                        } else {
                            permissionCreate(this.permissionForm).then(response => {
                                if (response.code === 0) {
                                    this.$message({
                                        title: '成功',
                                        message: '操作成功！',
                                        type: 'success',
                                        duration: 3000
                                    })
                                    this.dialogShow = false
                                    this.getList()
                                    this.$refs.permissionForm.resetFields()
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
                    if(row.children){
                        this.error('请先删除权限后，再删除权限组')
                    }
                    const data = {}
                    data.permissionId = row.permissionId
                    permissionDelete(data).then(response => {
                        if (response.code === 0) {
                            this.$message.success('删除成功');
                            this.getList()
                        }
                    })
                }).catch(() => {});
            },
            handleChange() {

            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 100%;
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

    ul,li{
        list-style: none;
    }
    ul {
        margin-top: 20px;
        border: 1px solid #f1eeee;
    }
    .icon-li{
        display: inline-block;
        padding: 10px;
        width: 110px;
        height: 100px;
    }
    .active{
        background-color: #eee;
    }
    .icon-li-content{
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .icon-li-content:hover{
        background-color: #eee;
    }
    .icon-li-content i{
        font-size: 36px;
        color: #606266;
    }
    .icon-li-content span{
        margin-top: 10px;
        color: #787878;
    }
</style>
