DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitaloutstandingbalance') THEN
        DROP TABLE capitaloutstandingbalance;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cashflow_schedule') THEN
        DROP TABLE cashflow_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fee_schedule') THEN
        DROP TABLE fee_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'costofcapital') THEN
        DROP TABLE costofcapital;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitaldeploymentschedule') THEN
        DELETE FROM capitaldeploymentschedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'capitalreturnschedule') THEN
        DELETE FROM capitalreturnschedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'final_fund_summary') THEN
        DROP TABLE final_fund_summary;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_summary') THEN
        DROP TABLE fund_summary;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grouped_cashflow_schedule') THEN
        DROP TABLE grouped_cashflow_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'loan_summary') THEN
        DROP TABLE loan_summary;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transposed_fund_summary') THEN
        DROP TABLE transposed_fund_summary;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'helper_cashflow_schedule') THEN
        DROP TABLE helper_cashflow_schedule;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'report') THEN
        DROP TABLE report;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'report_performance') THEN
        DROP TABLE report_performance;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_snapshot') THEN
        DROP TABLE performance_snapshot;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'unit_economics') THEN
        DROP TABLE unit_economics;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cumulative_net_proceeds') THEN
        DROP TABLE cumulative_net_proceeds;
    END IF;


    
END $$;
