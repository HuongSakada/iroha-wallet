<template>
    <div>
        <el-table 
            stripe
            :data="transactions.slice((currentPage-1)*pagesize, currentPage*pagesize)">
            <el-table-column width="40">
                <template slot-scope="scope">
                    <span
                        :class="[scope.row.from === 'you' ? 'withdraw' : 'deposit']"
                    >
                        <i :class="[scope.row.from === 'you' ? 
                            'withdraw el-icon-top' : 'deposit el-icon-bottom']">
                        </i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="Description">
                <template slot-scope="scope">
                    <span v-if="scope.row.from === 'you'">
                        Sent to {{ scope.row.to[0] }}
                    </span>

                    <span v-else>
                        Receive from {{ scope.row.from[0] }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="Amount">
                <template slot-scope="scope">
                    <span class="amount">
                        {{ scope.row.from === 'you' ? '−' : '+' }}{{ scope.row.amount }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="message" label="Message" />
            <el-table-column prop="date" label="Date" />
        </el-table>
        
        <div style="text-align: center; margin-top: 20px">
            <el-pagination
                layout="prev, pager, next"
                :page-size="pagesize"
                :total="transactions.length"
                @current-change="current_change">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Transaction',
    props: {
        transactions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            pagesize:10,
            currentPage:1
        }
    },
    methods: {
        current_change:function(currentPage){
            this.currentPage = currentPage;
        }
    }
}
</script>

<style scoped>
.el-table >>> thead {
    color: black
}
.deposit {
    color: green
}
.withdraw {
    color: red
}
.amount {
    font-weight: bold;
}
.el-pagination >>> .active {
    color: #e43e33
}
.el-pagination >>> li:hover, .el-pagination >>> button:hover {
    color: #e43f338c
}
</style>
